import { Model } from "chomex";

export default class DisableMissionNotificationSetting extends Model {
  static __ns = "DisableMissionNotificationSetting";

  missionId: number;

  static default = {
    "1": {
      missionId: 33// 前衛支援任務(南方)
    },
    "2": {
      missionId: 34// 決戦支援任務(南方)
    },
    "3": {
      missionId: 197// 前衛支援任務(イベント)
    },
    "4": {
      missionId: 198// 前衛支援任務(イベント)
    }
  }

  static hasMissionId(missionId: number | string): boolean {
    const setting = this.filter<DisableMissionNotificationSetting>(setting => setting.missionId == missionId);
    return setting.length > 0;
  }
}