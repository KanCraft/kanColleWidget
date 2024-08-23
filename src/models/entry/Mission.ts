import { MissionSpec } from "../../catalog";
import { NotificationEntryBase } from "./Base";

export class Mission extends NotificationEntryBase {
  public static get type() {
    return "mission";
  }
  public deck: number | string = 0; // 艦隊ID [2,3,4]
  public id: number | string = 0; // 遠征ID

  // カタログから来る基本情報 (idさえあればcatalogからひける)
  public title: string = "UNKNOWN"; // 遠征タイトル
  public time: number = 0; // 所要時間（ミリ秒）

  constructor(deckId: number | string, missionId: number | string, mission: MissionSpec) {
    super();
    this.id = missionId;
    this.title = mission.title;
    this.time = mission.time;
    this.deck = deckId;
  }

  override toNotificationID(): string {
    return `mission-${this.id}`;
  }
  override toNotificationOptions(): chrome.notifications.NotificationOptions<true> {
    return {
      iconUrl: "icons/128.png",
      title: "遠征完了",
      message: `まもなく第${this.deck}艦隊が「${this.title}」から帰投します`,
      type: "basic",
    }
  }
}
