import { Model } from "chomex";

export interface Scanned<T> {
  upcomming: T[];
  finished: T[];
}

export default class Queue extends Model {

  protected defaultIconURL = chrome.extension.getURL("/dest/img/app/icon.128.png");

  protected static _scan<T extends Queue>(constructor: typeof Queue, now: number, clean: boolean = true): Scanned<T> {
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

  protected _register<T extends Queue>(scheduled: number): T {
    this.scheduled = scheduled;
    return this.save();
  }

  public notificationOption(): chrome.notifications.NotificationOptions {
    throw new Error("overrideして使ってくれ");
  }
}
