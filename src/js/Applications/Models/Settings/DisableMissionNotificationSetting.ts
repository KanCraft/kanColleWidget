import { Model } from "chomex";

// このモデルの _id は ../Queue/Mission._id と同一なものとして扱う。
export default class DisableMissionNotificationSetting extends Model {
  static __ns = "DisableMissionNotificationSetting";

  static default = {
    "33": {}, // 前衛支援任務(南方)
    "34": {}, // 決戦支援任務(南方)
    "197": {}, // 前衛支援任務(イベント)
    "198": {} // 前衛支援任務(イベント)
  }
}