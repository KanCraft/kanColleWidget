/** build-release-note.ts
 * src/release-note.json の「未公開(current)エントリ」を git 履歴から再生成する。
 *
 * 旧 `make draft` の複雑な jq ロジックの置き換え。やることは2つだけ:
 *   1. 直近タグ..HEAD のコミットを集めて、現行バージョンのエントリに反映する。
 *   2. 既にタグが打たれた（公開済み）リリースのエントリには一切触れない。
 *
 * 「現行バージョン」= package.json の version。これがリリースノートの単一の真実源。
 *   - releases[0] が現行バージョンの未公開エントリなら、その commits/date を更新（accumulate）。
 *   - そうでなければ（= 新しいバージョンサイクルの開始なら）新エントリを先頭に追加。
 *
 * 実行: pnpm run release-note   または   tsx scripts/build-release-note.ts
 */

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

interface Commit { title: string; hash: string; }
interface Release { date: string; version: string; message?: string; commits?: Commit[]; }
interface ReleaseNote { reference?: { repo?: string }; releases: Release[]; }

const RELEASE_NOTE_PATH = join(process.cwd(), "src", "release-note.json");
const MAX_COMMITS = 30;

/** git をシェルを介さず引数配列で実行する（コマンドインジェクション回避）。 */
function git(...args: string[]): string {
  return execFileSync("git", args, { encoding: "utf-8" }).trim();
}

function readPackageVersion(): string {
  const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8"));
  return pkg.version as string;
}

/** 直近のタグ。1つも無ければ null。 */
function latestTag(): string | null {
  try {
    return git("describe", "--tags", "--abbrev=0");
  } catch {
    return null;
  }
}

/** range(例 "v4.8.2..HEAD") のコミットを新しい順で返す。bot 系はスキップ。 */
function commitsInRange(range: string): Commit[] {
  const raw = git("log", range, "--no-merges", "--pretty=format:%H%x09%an%x09%s");
  if (!raw) return [];
  return raw
    .split("\n")
    .map((line) => {
      const [hash, author, ...rest] = line.split("\t");
      return { hash, author, title: rest.join("\t") };
    })
    .filter((c) => !/bot/i.test(c.author))
    .slice(0, MAX_COMMITS)
    .map(({ hash, title }) => ({ hash, title }));
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function main(): void {
  const note = JSON.parse(readFileSync(RELEASE_NOTE_PATH, "utf-8")) as ReleaseNote;
  const pkgVersion = readPackageVersion();
  const currentVersion = `v${pkgVersion}`;
  const tag = latestTag();
  const tagVersion = tag ? (tag.startsWith("v") ? tag : `v${tag}`) : null;

  // 現行バージョンが既にタグ済み = 未公開の変更が無い → 何もしない
  if (tagVersion === currentVersion) {
    console.log(`[release-note] ${currentVersion} は既にタグ済みです。未公開エントリはありません。`);
    return;
  }

  const range = tag ? `${tag}..HEAD` : "HEAD";
  const commits = commitsInRange(range);

  const head = note.releases[0];
  if (head && head.version === currentVersion) {
    // 同一バージョンの未公開エントリを更新（accumulate）。message は人手の編集を保持。
    head.date = today();
    head.commits = commits;
    console.log(`[release-note] 既存の ${currentVersion} エントリを更新しました（${commits.length} commits）`);
  } else {
    // 新しいバージョンサイクル → 新エントリを先頭に追加
    note.releases.unshift({ date: today(), version: currentVersion, message: "", commits });
    console.log(`[release-note] 新しい ${currentVersion} エントリを追加しました（${commits.length} commits）`);
  }

  writeFileSync(RELEASE_NOTE_PATH, `${JSON.stringify(note, null, 2)}\n`);
  console.log(`[release-note] ${RELEASE_NOTE_PATH} を更新しました。message を編集してコミットしてください。`);
}

main();
