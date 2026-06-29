import { TriggerType } from ".";
import { MissionSpec } from "../../catalog";
import { KCWDate } from "../../utils";
import { NotificationConfigData } from "../configs/NotificationConfig";
import { NotificationEntryBase } from "./Base";

export class Mission extends NotificationEntryBase {
  public override readonly type = "mission";

  // 遠征は「残り時間が1分を切ると母港画面に戻ることで残り時間を待たずに完了する」ゲーム仕様がある。
  // そのため表示時間そのままで通知すると、実際に回収可能になるタイミング（最大1分前）より遅れる（#1811）。
  // 通知予定時刻・終了予定時刻の表示を一律で1分早めて、ゲーム内で帰投できるタイミングに揃える。
  public static readonly EARLY_RETURN_MARGIN = 60_000; // [ms]

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
    options: (trigger: TriggerType = TriggerType.END, overwrite: Partial<NotificationConfigData> = {}): chrome.notifications.NotificationCreateOptions => {
      if (trigger === TriggerType.START) {
        return {
          iconUrl: overwrite.icon ?? chrome.runtime.getURL("icons/128.png"),
          title: "遠征開始",
          message: `第${this.deck}艦隊が「${this.title}」へ出航しました.\n終了予定時刻は${KCWDate.ETA(Math.max(0, this.time - Mission.EARLY_RETURN_MARGIN)).format("HH:MM")}です`,
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
