
import Config from "../../Models/Config";
import NotificationService from "../../../Services/NotificationService";
import Assets from "../../../Services/Assets";

export function GetConfig(message) {
  if (!message.key) return {status: 400, message: "config key is not specified"};
  let config = Config.find(message.key);
  if (!config) return {status: 404, message: `config for key "${message.key}" not existing`};
  return config;
}
export function SetConfig(/* message */) {
  return {minase: "いのり"};
}

// TODO: どっかやる
export function TriggerEvent(/* message */) {

  // 今んとこエイプリルフールだけ
  const now = new Date();
  if (now.getMonth() != 3 || now.getDate() != 1) return;

  const config = Config.find("aprilfools");
  if (now.getFullYear() <= config.year) return; // なにもしない

  const n = new NotificationService();
  const a = new Assets(Config);
  return n.create("aprilfools", {
    type:    "basic",
    iconUrl: a.getDefaultIcon(),
    title:   "重要なお知らせ",
    message: `『艦これウィジェット』がアカウント停止対象である可能性があるとのことで、公式から公開停止要請を受けました。
『艦これウィジェット』の開発背景および当初よりの表明の通り、『艦これウィジェット』の公開を停止します。
詳細は以下のボタンをクリックしてください。`,
    buttons: [
      {title: "詳細を見る"},
      {title: "はいはい、わかったわかった"}
    ],
    requireInteraction: true
  });
}
