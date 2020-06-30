import Queue, { Scanned } from "./Queue";

export default class Tiredness extends Queue {

  static __ns = "Tiredness";

  static scan(clean = true): Scanned<Tiredness> {
    return super._scan<Tiredness>(Tiredness, Date.now(), clean);
  }

  deck: number | string;
  interval: number; // 回復に要する時間（ミリ秒）

  register(scheduled: number): Tiredness {
    return super._register<Tiredness>(scheduled);
  }

  notificationOption(): chrome.notifications.NotificationOptions {
    return {
      iconUrl: this.defaultIconURL,
      message: `間もなく、第${this.deck}艦隊の疲労が回復する見込みです`,
      requireInteraction: true,
      title: "疲労回復",
      type: "basic",
    };
  }

}
