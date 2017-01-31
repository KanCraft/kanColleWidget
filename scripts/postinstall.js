/* global process:false */
const fs = require("fs");
require("colors"); // String.{color} が使えるようになる

const prefix = "[艦これウィジェット]";
const appConfigFilePath = "./app-config.json";

const createAppConfigFileIfNotExists = (fpath) => {
    console.log(prefix.green, "app-configの作成".underline);
    console.log(`${fpath} の存在チェックします`);
    if (fs.existsSync(fpath)) return console.log("すでにファイルがあるのでそれを使います :)");
    console.log(`${fpath} を新規作成します`);
    const appConfigTemplate = {
        "twitter": {
            "request_url":     "https://api.twitter.com/oauth/request_token",
            "authorize_url":   "https://api.twitter.com/oauth/authorize",
            "access_url":      "https://api.twitter.com/oauth/access_token",
            "consumer_key":    "https://apps.twitter.com/ でCreate New Appするともらえるやつ",
            "consumer_secret": "https://apps.twitter.com/ でCreate New Appするともらえるやつ"
        }
    };
    fs.writeFileSync(fpath, JSON.stringify(appConfigTemplate, null, 2));
    if (!fs.existsSync(fpath)) {
        console.log("ファイルの作成に失敗しました :(".red);
        process.exit(1);
    }
    console.log(`${appConfigFilePath} が作成されました :)`);
    console.log("Twitter連携をデバッグする場合は https://apps.twitter.com/ で Consumer Key/Secret を作成してください".yellow);
};

createAppConfigFileIfNotExists(appConfigFilePath);

console.log(prefix.green, "開発の準備が整いました. next) yarn start".underline);
