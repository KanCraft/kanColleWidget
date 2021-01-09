/**
 * リリースアナウンスツイートを生成するスクリプト
 */
import * as shell from "child_process";
import { promises as fs } from "fs";

function packageEnv(): string {
  switch (process.env.NODE_ENV) {
  case "staging":
    return "[v3テスト版] ";
  case "production":
    return "【リリース情報】";
  default:
    return "[DEBUG] ";
  }
}

function constructTweetText(head, commits, omitted = false): string {
  const MAX_TWEET_LENGTH = 140;
  const TAG = "#艦これウィジェット";
  const status = packageEnv() + head + "\n\n" + commits.join("\n") + (omitted ? "\nなど" : "") + "\n\n" + TAG;
  if (status.length > MAX_TWEET_LENGTH) {
    return constructTweetText(head, commits.slice(0, -1), true);
  }
  return status;
}

async function __main__() {
  const current_tag = shell.execSync("git describe --abbrev=0 --tags").toString().trim();
  console.log("CURRENT TAG:", current_tag);
  const last_commit = shell.execSync("git rev-list --tags --skip=1 --max-count=1 --no-merges").toString().trim();
  console.log("LAST COMMIT:", last_commit);
  const previous_tag = shell.execSync(`git describe --abbrev=0 --tags ${last_commit}`).toString().trim();
  console.log("PREVIOUS TAG:", previous_tag);
  const commits = shell.execSync(`git log --pretty="%s" --no-merges ${previous_tag}..${last_commit}`).toString().trim().split("\n");
  console.log("COMMITS:");
  console.log(commits);
  const status = constructTweetText(current_tag, commits);
  console.log("STATUS:", status);
  await fs.writeFile("announcement.txt", status);
}

// 直接呼ばれたときにやるやつ
if (require.main == module) {
  __main__();
}
