import { KCWDate } from "../../utils";
import { NotificationEntryBase, TriggerType } from "./Base";

export class Recovery extends NotificationEntryBase {
  public override readonly type = "recovery";
  constructor(
    public dock: number,
    public time: number, // 所要時間（ミリ秒）
  ) {
    super();
  }

  override $n = {
    id: (trigger: TriggerType = TriggerType.END): string => {
      return `/${this.type}/${this.dock}/${trigger}`;
    },
    options: (trigger: TriggerType = TriggerType.END): chrome.notifications.NotificationOptions<true> => {
      if (trigger === TriggerType.START) {
        return {
          iconUrl: "icons/128.png",
          title: "修復開始",
          message: `修復のため第${this.dock}番ドックに入渠しました.\n完了予定時刻は${KCWDate.ETA(this.time).format("HH:MM")}です`,
          type: "basic",
        }
      }
      return {
        iconUrl: "icons/128.png",
        title: "修復完了",
        message: `第${this.dock}番ドックでの修復がまもなく完了します`,
        type: "basic",
      }
    }
  }
}