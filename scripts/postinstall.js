const fs = require("fs").promises;


const check_secrets = async () => {
  if (process.env.NODE_ENV == "production" || process.env.NODE_ENV == "staging") {
    return console.log("[INFO]", "リリース用環境なので環境変数があると信じています.")
  }
  try {
    await fs.stat("./config/dev/firebase.json");
    console.log("[INFO]", "./config/dev/firebase.json を発見しました。")
  } catch {
    console.log("[INFO]", "./config/dev/firebase.json が見つかりません。")
    await fs.copyFile("./config/example/firebase.json", "./config/dev/firebase.json");
    console.log("[INFO]", "exampleをコピっておきましたが、Twitter連携を開発するときはconfig/devを変更してください。")
    console.log("[INFO]", "firebase.jsonについては以下を参照: https://console.firebase.google.com/")
  }
  try {
    await fs.stat("./config/dev/twitter.json");
    console.log("[INFO]", "./config/dev/twitter.json を発見しました。")
  } catch {
    console.log("[INFO]", "./config/dev/twitter.json が見つかりません。")
    await fs.copyFile("./config/example/twitter.json", "./config/dev/twitter.json");
    console.log("[INFO]", "exampleをコピっておきましたが、Twitter連携を開発するときはconfig/devを変更してください。")
    console.log("[INFO]", "twitter.jsonについては以下を参照: https://developer.twitter.com/en/apps")
  }
};

const main = async () => {
  await check_secrets();
};

// 直接呼ばれたときにやるやつ
if (require.main == module) {
  main();
}