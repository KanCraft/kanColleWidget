const shell = require("child_process");
const fs = require("fs");

function packageEnv() {
  return "【リリース情報】" + /develop/.test(process.env.TRAVIS_BRANCH) ? "[v3テスト版] " : " ";
}

function constructTweetText(head, commits, omitted) {
  const MAX_TWEET_LENGTH = 160;
  const TAG = "#艦これウィジェット";
  const status = packageEnv() + head + "\n\n" + commits.join("\n") + (omitted ? "\nなど" : "") + "\n\n" + TAG;
  if (status.length > MAX_TWEET_LENGTH) {
    return constructTweetText(head, commits.slice(0, -1), true);
  }
  return status;
}

function main(cb) {
  const current_tag = shell.execSync("git describe --abbrev=0 --tags").toString().trim();
  const last_commit = shell.execSync("git rev-list --tags --skip=1 --max-count=1 --no-merges").toString().trim();
  const previous_tag = shell.execSync(`git describe --abbrev=0 --tags ${last_commit}`).toString().trim();
  const commits = shell.execSync(`git log --pretty="%s" --no-merges ${previous_tag}..${last_commit}`).toString().trim().split("\n").reverse();
  const status = constructTweetText(current_tag, commits);
  fs.writeFile("announcement.txt", status, cb);
}

// 直接呼ばれたときにやるやつ
if (require.main == module) {
  main((err, stdout, stderr) => {
    if (err) {
      console.error(err, stderr);
      process.exit(1);
    }
    console.log("OK", stdout);
  });
}
