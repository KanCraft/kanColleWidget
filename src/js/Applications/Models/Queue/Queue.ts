import { Model } from "chomex";

export interface Scanned<T> {
  upcomming: T[];
  finished: T[];
}

export default class Queue extends Model {

  protected static _scan<T extends Queue>(now: number): Scanned<T> {
    return {
      finished: [],
      upcomming: [],
    };
  }

  // 終了予定時刻タイムスタンプ（ミリ秒）
  public scheduled: number;

  protected _register<T extends Queue>(scheduled: number): T {
    this.scheduled = scheduled;
    return this.save();
  }
}
