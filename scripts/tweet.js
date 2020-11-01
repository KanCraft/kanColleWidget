const Twitter = require("twitter");

const twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// __main__
if (require.main == module) {
  if (process.argv.length < 3) return;
  const status = process.argv[2];
  twitter.post("statuses/update", {status}).then(tweet => {
    console.log(`Tweet:\thttps://twitter.com/${tweet.user.screen_name}/statuses/${tweet.id_str}\nStatus:\t${status}`);
    process.exit(0);
  }).catch(err => {
    console.error("Error:", err);
    process.exit(1);
  });
}
