/**
 * エゴサするやつ。
 * 使い方
 *    ts-node --script-mode ./scripts/egosearch.js
 */
import * as Twitter from "twitter";

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const sleep = (millisec) => {
  return new Promise(resolve => setTimeout(() => resolve(millisec), millisec));
};

const __main__ = async (intervalHours: number) => {
  const lasttime = new Date(Date.now() - (intervalHours * 60 * 60 * 1000));
  const since = [
    `${lasttime.getFullYear()}-${("0" + (lasttime.getMonth() + 1)).slice(-2)}-${("0" + lasttime.getDate()).slice(-2)}`,
    `${("0" + lasttime.getHours()).slice(-2)}:00:00`,
    "JST"
  ].join("_"); // 前回実行からのツイートのみ検索する
  const q = `艦これウィジェット OR #艦これウィジェット OR #編成キャプチャ -from:KanColleWidget -RT since:${since}`;
  console.log("[INFO]", q);
  const params = { q };
  let statuses = [];
  try {
    const res = await client.get("search/tweets", params);
    statuses = res.statuses;
  } catch (err) {
    console.log("[ERROR]", err);
    // FIXME: process.exit(1); // ひとまずTwitterAPI対応できるまでエラーは無視
    return;
  }
  console.log("[INFO]", "FOUND", statuses.length);
  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    console.log("[DEBUG]", i, status.id_str, status.user.screen_name);
    console.log(status.text);
    await sleep(5 * 1000 * Math.random());
    try {
      await client.post(`statuses/retweet/${status.id_str}`, {});
    } catch (err) {
      console.log("[ERROR]", err);
    }
  }
  console.log("[INFO]", "DONE");
};

if (require.main == module) {
  let intervalHours = 8;
  if (process.argv.length > 2) {
    const parsed = parseInt(process.argv[2], 10);
    if (parsed <= 24) {
      intervalHours = parsed;
    }
  }
  __main__(intervalHours);
}
