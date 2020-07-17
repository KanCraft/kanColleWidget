import { Model } from "chomex";

export enum InAppButtonPosition {
  RightTop = "right-top",
}

export default class InAppButtonSetting extends Model {
  static __ns = "InAppButtonSetting";
  static default = {
    "user": {
      mute: true,
      screenshot: true,
      position: InAppButtonPosition.RightTop,
    },
  };
  mute: boolean;
  screenshot: boolean;
  static user(): InAppButtonSetting {
    return this.find("user");
  }
}