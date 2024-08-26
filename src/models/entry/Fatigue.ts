import { M } from "../../utils";
import { NotificationEntryBase, TriggerType } from "./Base";

export class Fatigue extends NotificationEntryBase {
  public static type = "fatigue";
  constructor(
    public deck: number | string, // 艦隊
    public time: number = 15 * M, // 疲労回復までの時間（ミリ秒）
  ) {
    super();
  }

  // 疲労の場合は、STARTはたぶん使わないけど
  override $n = {
    id: (type: TriggerType = TriggerType.END): string => {
      if (type === TriggerType.START) return `/fatigue/${this.deck}/${TriggerType.START}`;
      if (type === TriggerType.END) return `/fatigue/${this.deck}/${TriggerType.END}`;
      return `/fatigue/${this.deck}/${TriggerType.UNKNOWN}`;
    },
    options: (type: TriggerType = TriggerType.END): chrome.notifications.NotificationOptions<true> => {
      if (type === TriggerType.START) {
        return {
          iconUrl: "icons/128.png",
          title: "疲労回復開始",
          message: `第${this.deck}艦隊の疲労が回復しました`,
          type: "basic",
        }
      }
      return {
        iconUrl: "icons/128.png",
        title: "疲労回復",
        message: `まもなく第${this.deck}艦隊の疲労が完全に回復する見込みです`,
        type: "basic",
      }
    },
  };
}