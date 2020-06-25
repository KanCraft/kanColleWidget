const shell = require("child_process");
const fs = require("fs");

function packageEnv() {
  switch (process.env.NODE_ENV) {
  case "staging":
    return "[v3テスト版] "
  case "production":
    return "【リリース情報】"
  default:
    return "[DEBUG] "
  }
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
  console.log("CURRENT TAG:", current_tag);
  const last_commit = shell.execSync("git rev-list --tags --skip=1 --max-count=1 --no-merges").toString().trim();
  console.log("LAST COMMIT:", last_commit);
  const previous_tag = shell.execSync(`git describe --abbrev=0 --tags ${last_commit}`).toString().trim();
  console.log("PREVIOUS TAG:", previous_tag);
  const commits = shell.execSync(`git log --pretty="%s" --no-merges ${previous_tag}..${last_commit}`).toString().trim().split("\n").reverse();
  console.log("COMMITS:");
  console.log(commits);
  const status = constructTweetText(current_tag, commits);
  console.log("STATUS:", status);
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
