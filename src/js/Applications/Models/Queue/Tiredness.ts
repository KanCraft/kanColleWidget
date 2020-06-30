import Queue, { Scanned, Kind } from "./Queue";

export default class Tiredness extends Queue {

  static __ns = Kind.Tiredness;

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
      title: "疲労回復",
      message: `間もなく、第${this.deck}艦隊の疲労が回復する見込みです`,
      requireInteraction: true,
    };
  }

}
