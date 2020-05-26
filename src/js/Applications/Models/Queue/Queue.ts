import { Model } from "chomex";

export interface Scanned<T> {
  upcomming: T[];
  finished: T[];
}

export default class Queue extends Model {

  protected defaultIconURL = chrome.extension.getURL("/dest/img/app/icon.128.png");

  protected static _scan<T extends Queue>(constructor: typeof Queue, now: number, clean = true): Scanned<T> {
    return constructor.list<T>().reduce((scanned, it) => {
      if (it.scheduled < now) {
        scanned.finished.push(it);
        if (clean) it.delete();
      } else {
        scanned.upcomming.push(it);
      }
      return scanned;
    }, { upcomming: [], finished: [] } as Scanned<T>);
  }

  // インスタンスからの__nsのアクセスはこれを使う
  kind(): string {
    return (this.constructor as any).__ns;
  }

  toNotificationID(params: Record<string, any> = {}): string {
    const search = new URLSearchParams(params);
    search.set("id", this._id);
    return `${this.kind()}?${search.toString()}`;
  }

  // 終了予定時刻タイムスタンプ（ミリ秒）
  scheduled: number;

  protected _register<T extends Queue>(scheduled: number): T {
    this.scheduled = scheduled;
    return this.save();
  }

  notificationOption(): chrome.notifications.NotificationOptions {
    throw new Error("overrideして使ってくれ");
  }
}
