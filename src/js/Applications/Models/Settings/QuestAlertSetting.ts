import { Model } from "chomex";
import { Quest } from "../Quest";

export default class QuestAlertSetting extends Model {
  static __ns = "QuestAlertSetting";
  static defaultIcon = chrome.extension.getURL("dest/img/app/icon.128.png")
  static default = {
    "user": {
      enabled: true,
    },
  };
  enabled: boolean;

  static user(): QuestAlertSetting {
    return QuestAlertSetting.find("user");
  }

  getChromeOptions(quests: Quest[]): chrome.notifications.NotificationOptions {
    const message = quests.map(q => `[${q.id}] ${q.title}`).join("\n");
    return {
      type: "basic",
      title: "未着手任務があります",
      message,
      iconUrl: QuestAlertSetting.defaultIcon, // TODO: 設定できるようにしよか
    };
  }

  toNotificationID() {
    return `QuestAlert?ts=${Date.now()}`;
  }
}