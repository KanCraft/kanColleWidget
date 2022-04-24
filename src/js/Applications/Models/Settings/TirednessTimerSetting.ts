import { Model } from "chomex";

export enum ClickAction {
  RemoveConfirm = "remove-confirm", // 確認付き削除
  RemoveSilently = "remove-silently", // 黙って削除
}

export default class TirednessTimerSetting extends Model {
  static __ns = "TirednessTimerSetting";
  static default = {
    "user": {
      clickAction: ClickAction.RemoveConfirm,
    }
  }
  static user(): TirednessTimerSetting {
    return this.find("user");
  }
  clickAction: ClickAction;
}