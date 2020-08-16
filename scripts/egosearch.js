/**
 * エゴサするやつ。
 * 使い方
 *    node ./scripts/egosearch.js
 */
const Twitter = require("twitter");

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const sleep = (millisec) => {
  return new Promise(resolve => setTimeout(() => resolve(millisec), millisec));
}

const main = async () => {
  const yesterday = new Date(Date.now() - (24 * 60 * 60 * 1000));
  const since = `${yesterday.getFullYear()}-${('0' + (yesterday.getMonth() + 1)).slice(-1)}-${('0' + yesterday.getDate()).slice(-2)}`
  const q = `艦これウィジェット OR #艦これウィジェット -RT since:${since}`;
  const count = 40;
  const params = { q, count }
  const { statuses } = await client.get('search/tweets', params);
  console.log("[INFO]", "FOUND", statuses.length);
  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    console.log("[DEBUG]", i, status.id_str, status.user.screen_name, status.text);
    await sleep(1000);
    try {
      const { retweeted } = await client.post(`statuses/retweet/${status.id_str}`, {});
      console.log("[DEBUG]", "RETWEETED", retweeted);
    } catch (err) {
      console.log("[ERROR]", err);
    }
  }
  console.log("[INFO]", "DONE");
};

// __main__
if (require.main == module) {
  main();
}
