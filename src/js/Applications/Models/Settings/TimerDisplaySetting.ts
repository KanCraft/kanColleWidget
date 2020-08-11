import { Model } from "chomex";

export enum DisplayFormat {
  ScheduledTime = "scheduled-time", // 予定時刻表示
  RemainingTIme = "remaining-time", // 残り時間表示
}

export default class TimerDisplaySetting extends Model {
  static __ns = "TimerDisplaySetting";
  static default = {
    "user": {
      format: DisplayFormat.ScheduledTime,
    }
  }
  static user(): TimerDisplaySetting {
    return this.find("user");
  }
  format: DisplayFormat;
}