import { Model } from "chomex";

export enum DamageSnapshotType {
  Disabled = "disabled", // 使わない
  InApp = "inapp", // ゲーム内
  Separate = "separate", // 別窓
}

export default class DamageSnapshotSetting extends Model {
  static __ns = "DamageSnapshotSetting";
  static default = {
    "user": {
      type: DamageSnapshotType.InApp,
      frame: {
        size: { height: 200 },
        position: { left: 0, top: 0 },
      }
    },
  };
  type: DamageSnapshotType;
  frame: {
    size: { height: number }
    position: { left: number, top: number }
  }
  static user(): DamageSnapshotSetting {
    return this.find("user");
  }

  /**
   * chrome.windows.createで呼ばれるためのCreateDataつくり
   */
  toWindowCreateData(): chrome.windows.CreateData {
    return {
      height: this.frame.size.height,
      left: this.frame.position.left,
      top: this.frame.position.top,
      type: "popup",
    };
  }
}