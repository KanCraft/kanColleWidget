const Twitter = require("twitter");
const shell   = require("child_process");

function packageEnv() {
  return /develop/.test(process.env.TRAVIS_BRANCH) ? "[test] " : "";
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

function tweet(tag, commits) {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });
  const status = constructTweetText(tag, commits, false);
  return client.post("statuses/update", {status});
}

function main(params) {
  const current_tag = shell.execSync("git describe --abbrev=0 --tags").toString().trim();
  const last_commit = shell.execSync("git rev-list --tags --skip=1 --max-count=1").toString().trim();
  const previous_tag = shell.execSync(`git describe --abbrev=0 --tags ${last_commit}`).toString().trim();
  const commits = shell.execSync(`git log --pretty="%s" ${previous_tag}..HEAD`).toString().trim().split("\n");
  return Promise.all([
    tweet(current_tag, commits),
  ]);
};

// 直接呼ばれたときにやるやつ
if (require.main == module) {
  main().then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
    throw err;
  });
}
