import { TriggerType } from ".";
import { M } from "../../utils";
import { NotificationEntryBase } from "./Base";

export class Fatigue extends NotificationEntryBase {
  public override readonly type = "fatigue";
  constructor(
    public deck: number | string, // 艦隊
    public seamap: { area: number | string, info: number | string }, // 海域
    public time: number = 15 * M, // 疲労回復までの時間（ミリ秒）
  ) {
    super();
  }

  // 疲労の場合は、STARTはたぶん使わないけど
  override $n = {
    id: (trigger: TriggerType = TriggerType.END): string => {
      return `/${this.type}/${trigger}/${this.deck}`;
    },
    options: (trigger: TriggerType = TriggerType.END): chrome.notifications.NotificationOptions<true> => {
      if (trigger === TriggerType.START) {
        return {
          iconUrl: chrome.runtime.getURL("icons/128.png"),
          title: "疲労回復開始",
          message: `第${this.deck}艦隊の疲労が回復しました`,
          type: "basic",
        }
      }
      return {
        iconUrl: chrome.runtime.getURL("icons/128.png"),
        title: "疲労回復",
        message: `まもなく第${this.deck}艦隊の疲労が完全に回復する見込みです`,
        type: "basic",
      }
    },
  };
}