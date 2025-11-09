import { TriggerType } from ".";
import { MissionSpec } from "../../catalog";
import { KCWDate } from "../../utils";
import { NotificationConfigData } from "../configs/NotificationConfig";
import { NotificationEntryBase } from "./Base";

export class Mission extends NotificationEntryBase {
  public override readonly type = "mission";
  public deck: number | string = 0; // 艦隊ID [2,3,4]
  public id: number | string = 0; // 遠征ID

  // カタログから来る基本情報 (idさえあればcatalogからひける)
  public title: string = "UNKNOWN"; // 遠征タイトル
  public time: number = 0; // 所要時間（ミリ秒）

  constructor(deckId: string, missionId: number | string, mission: MissionSpec) {
    super();
    this.id = missionId;
    this.title = mission.title;
    this.time = mission.time;
    this.deck = deckId;
  }

  override $n = {
    id: (trigger: TriggerType = TriggerType.END): string => {
      return `/${this.type}/${trigger}/${this.deck}`;
    },
    options: (trigger: TriggerType = TriggerType.END, overwrite: Partial<NotificationConfigData> = {}): chrome.notifications.NotificationOptions<true> => {
      if (trigger === TriggerType.START) {
        return {
          iconUrl: overwrite.icon ?? chrome.runtime.getURL("icons/128.png"),
          title: "遠征開始",
          message: `第${this.deck}艦隊が「${this.title}」へ出航しました.\n終了予定時刻は${KCWDate.ETA(this.time).format("HH:MM")}です`,
          type: "basic",
          requireInteraction: overwrite.stay ?? false,
        }
      }
      return {
        iconUrl: overwrite.icon ?? chrome.runtime.getURL("icons/128.png"),
        title: "遠征完了",
        message: `まもなく第${this.deck}艦隊が「${this.title}」から帰投します`,
        type: "basic",
        requireInteraction: overwrite.stay ?? false,
      }
    }
  };
}
