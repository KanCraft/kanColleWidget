import { Model } from "chomex";

export interface Scanned<T> {
  upcomming: T[];
  finished: T[];
}

export default class Queue extends Model {

  protected static _scan<T extends Queue>(constructor: any, now: number, clean: boolean = true): Scanned<T> {
    const s = { finished: [], upcomming: [] };
    constructor.list().map((q: Queue) => {
      if (q.scheduled < now) {
        s.finished.push(q);
        if (clean) {
          q.delete();
        }
      } else {
        s.upcomming.push(q);
      }
    });
    return s;
  }

  // 終了予定時刻タイムスタンプ（ミリ秒）
  public scheduled: number;

  public notificationOption(): chrome.notifications.NotificationOptions {
    throw new Error("overrideして使ってくれ");
  }

  protected _register<T extends Queue>(scheduled: number): T {
    this.scheduled = scheduled;
    return this.save();
  }
}
