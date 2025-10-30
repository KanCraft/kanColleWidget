// import { useNavigate } from "react-router-dom";
import { FoldableSection } from "../FoldableSection";

export function DevelopmentInfoView({ releasenote }: { releasenote: ReleaseNoteObject }) {
  const repo = new URL(releasenote.reference.repo);
  return (
    <FoldableSection title="開発情報" id="devinfo">
      <div className="mb-4">
        {releasenote.releases.map((release) => <ReleaseEntry key={release.version} release={release} repo={repo} />)}
      </div>
    </FoldableSection>
  )
}

export interface ReleaseNoteObject {
  reference: { repo: string };
  releases: Release[];
}

export interface Release {
  date: string;
  version: string;
  message?: string;
  commits?: Commit[];
  announce?: Announce;
}

interface Commit {
  title: string;
  hash: string;
}

interface Announce {
  message: string;
  effective?: {
    since: AnnounceSinceType;
    until: AnnounceUntilType;
  };
}

type AnnounceSinceType =
  0 | // 最初から
  string; // その他も日時文字列

type AnnounceUntilType =
  "READ" | // 読むまで
  "PERSIST" | // このannouncementがある限りずっと
  string; // その他の日時文字列

function ReleaseEntry({ release, repo }: { release: Release, repo: URL }) {
  return (
    <div className="font-mono">
      <h2 className="text-lg font-bold">{release.version} ({release.date})</h2>
      {release.message || release.announce ? <p className="pl-2 py-1 border-l-4 mb-1 italic">{release.message || release.announce?.message}</p> : null}
      {release.commits ? <div>
        {release.commits.map((commit) => <CommitEntryView key={commit.hash} commit={commit} repo={repo} />)}
      </div> : null}
    </div>
  )
}

function CommitEntryView({commit, repo}: {commit: Commit, repo: URL}) {
  const url = repo.toString().replace(/\/+$/, "") + `/commit/${commit.hash}`;
  return (
    <a href={url} target="_blank" className="flex space-x-2 hover:bg-stone-100">
      <div className="text-blue-600"><pre>{commit.hash.slice(0, 7)}</pre></div>
      <div>{commit.title}</div>
    </a>
  )
}