/**
 * リリースノートを読み込み、X向けリリースアナウンス文を生成して出力するスクリプト
 *
 * 使用例:
 *   pnpm exec tsx scripts/generate-release-announce.ts
 *   pnpm exec tsx scripts/generate-release-announce.ts v4.0.15
 *   pnpm exec tsx scripts/generate-release-announce.ts v4.0.15 --beta
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

interface ReleaseNote {
  reference?: { repo?: string };
  releases: Release[];
}

interface Release {
  date: string;
  version: string;
  message?: string;
  commits: Commit[];
}

interface Commit {
  title: string;
  hash: string;
}

const RELEASE_NOTE_PATH = join(process.cwd(), "src", "release-note.json");
const TWEET_LIMIT = 280;
const HASH_TAGS = ["#艦これウィジェット"];

interface AnnounceOptions {
  version?: string;
  beta?: boolean;
}

const main = () => {
  const options = parseOptions(process.argv.slice(2));
  const note = loadReleaseNote();
  const release = selectRelease(note.releases, options.version);

  if (!release) {
    console.error("対象のリリースが見つかりませんでした:", options.version ?? "最新リリース");
    process.exit(1);
  }

  const tweet = composeTweet(note, release, options);
  console.log(tweet);
};

const parseOptions = (argv: string[]): AnnounceOptions => {
  const options: AnnounceOptions = {};
  for (const arg of argv) {
    if (arg === "--beta") {
      options.beta = true;
      continue;
    }
    if (arg.startsWith("-")) {
      console.warn("未対応のオプションを無視します:", arg);
      continue;
    }
    if (!options.version) {
      options.version = arg;
      continue;
    }
    console.warn("複数のバージョン指定を検出したため無視します:", arg);
  }
  return options;
};

const loadReleaseNote = (): ReleaseNote => {
  const raw = readFileSync(RELEASE_NOTE_PATH, "utf8");
  return JSON.parse(raw) as ReleaseNote;
};

const selectRelease = (releases: Release[], targetVersion?: string): Release | undefined => {
  if (targetVersion) {
    return releases.find((item) => item.version === targetVersion);
  }

  return [...releases].sort((a, b) => (a.date < b.date ? 1 : -1))[0];
};

const composeTweet = (note: ReleaseNote, release: Release, options: AnnounceOptions): string => {
  const repoUrl = note.reference?.repo?.replace(/\/$/, "");
  const detailUrl = repoUrl ? `${repoUrl}/releases/tag/${release.version}` : undefined;
  let text = "";

  appendLine(() =>
    options.beta
      ? `艦これウィジェット ${release.version} ベータ版を公開しました（${release.date}）。`
      : `艦これウィジェット ${release.version} をリリースしました（${release.date}）。`,
  );

  if (options.beta) {
    appendLine(() => "ベータ版へのフィードバックをお待ちしています。");
  }

  const releaseMessage = (release.message ?? "").trim();
  if (releaseMessage.length > 0) {
    appendLine(() => truncateToFit(releaseMessage));
  }

  const highlights = extractHighlights(release);
  if (highlights.length > 0) {
    for (let count = Math.min(3, highlights.length); count >= 1; count--) {
      const summaryLine = composeHighlightLine(highlights, count);
      if (canFit(summaryLine)) {
        appendLine(() => summaryLine);
        break;
      }
    }
  }

  if (detailUrl) {
    const detailLine = `詳細: ${detailUrl}`;
    if (canFit(detailLine)) {
      appendLine(() => detailLine);
    }
  }

  appendHashtags(options);

  return text;

  function appendLine(lineBuilder: () => string): void {
    const line = lineBuilder();
    if (!line) {
      return;
    }
    const candidate = text ? `${text}\n${line}` : line;
    if (charCount(candidate) <= TWEET_LIMIT) {
      text = candidate;
    }
  }

  function truncateToFit(input: string): string {
    const available = TWEET_LIMIT - (text ? charCount(text) + 1 : 0);
    if (available <= 0) return "";
    const characters = Array.from(input);
    if (characters.length <= available) {
      return input;
    }
    if (available === 1) {
      return "…";
    }
    return `${characters.slice(0, available - 1).join("")}…`;
  }

  function canFit(line: string): boolean {
    const candidate = text ? `${text}\n${line}` : line;
    return charCount(candidate) <= TWEET_LIMIT;
  }

  function appendHashtags(currentOptions: AnnounceOptions): void {
    const tags = new Set(HASH_TAGS.map((tag) => tag.trim()).filter((tag) => tag.length > 0));
    if (currentOptions.beta) {
      tags.add("#ベータ版");
    }
    if (tags.size === 0) {
      return;
    }
    const line = Array.from(tags).join(" ");
    if (canFit(line)) {
      appendLine(() => line);
    }
  }
};

const extractHighlights = (release: Release): string[] => {
  const commits = collectReleaseCommits(release);
  return commits
    .map((commit) => commit.title.trim())
    .filter((title) => title.length > 0);
};

const charCount = (value: string): number => Array.from(value).length;

const collectReleaseCommits = (release: Release): Commit[] => {
  const result: Commit[] = [];
  for (const commit of release.commits) {
    const title = commit.title.trim();
    if (isSemverTitle(title)) {
      break;
    }
    result.push(commit);
  }
  return result;
};

const isSemverTitle = (title: string): boolean => /^v?\d+\.\d+\.\d+(?:[-+].+)?$/i.test(title);

const composeHighlightLine = (highlights: string[], take: number): string => {
  const selected = highlights.slice(0, take);
  if (highlights.length > take) {
    return `主な変更: ${selected.join(" / ")} / ほか ${highlights.length - take} 件`;
  }
  return `主な変更: ${selected.join(" / ")}`;
};

main();
