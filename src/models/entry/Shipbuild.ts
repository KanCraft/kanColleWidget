import { TriggerType } from ".";
import { KCWDate } from "../../utils";
import { NotificationEntryBase } from "./Base";

export class Shipbuild extends NotificationEntryBase {
  public static type = "shipbuild";
  constructor(
    public dock: number,
    public time: number, // 所要時間（ミリ秒）
  ) { super(); } 

  override $n = {
    id: (trigger: TriggerType = TriggerType.END): string => {
      return `/${this.type}/${trigger}/${this.dock}`;
    },
    options: (trigger: TriggerType = TriggerType.END): chrome.notifications.NotificationOptions<true> => {
      if (trigger === TriggerType.START) {
        return {
          iconUrl: "icons/128.png",
          title: "建造開始",
          message: `第${this.dock}番ドックにて新艦建造を開始しました.\n完了予定時刻は${KCWDate.ETA(this.time).format("HH:MM")}です`,
          type: "basic",
        }
      }
      return {
        iconUrl: "icons/128.png",
        title: "建造完了",
        message: `第${this.dock}番ドックでの新艦建造がまもなく完了します`,
        type: "basic",
      }
    }
  }
}