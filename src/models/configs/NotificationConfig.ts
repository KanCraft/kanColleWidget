import { Model } from "jstorm/chrome/local";
import { EntryType, NotificationId, TIMER_ENTRY_TYPES, TriggerType } from "../entry";

export interface NotificationConfigData {
  enabled: boolean;
  sound: string | null;
  icon: string | null;
  stay: boolean;
}

// 任務未着手通知は Queue のタイマーEntryを持たないため EntryType には加えず、
// NotificationConfig の1エントリとして直接キーを持つ（開始/完了のペアが無い一発通知）
export const QUEST_ALERT_NOTIFICATION_ID = "/quest-alert/start";

// タイマー系通知（種別×トリガー）の既定値。生成時はキーごとに spread で複製し共有参照を避ける。
const TIMER_NOTIFICATION_DEFAULT: NotificationConfigData = {
  enabled: true,
  sound: null,
  icon: null,
  stay: false,
};

export class NotificationConfig extends Model {
  static override _namespace_ = "NotificationConfig";
  static override default = {
    [NotificationId.configKey("default", TriggerType.START)]: {
      enabled: true,
      sound: null,
      icon: chrome.runtime.getURL("icons/128.png"),
      stay: false,
    },
    [NotificationId.configKey("default", TriggerType.END)]: {
      enabled: true,
      sound: null,
      icon: chrome.runtime.getURL("icons/128.png"),
      stay: false,
    },
    // タイマーEntryを持つ4種別 × [開始, 完了] の設定レコードを直積で生成する。
    ...Object.fromEntries(
      TIMER_ENTRY_TYPES.flatMap((type) =>
        [TriggerType.START, TriggerType.END].map(
          (trigger): [string, NotificationConfigData] => [
            NotificationId.configKey(type, trigger),
            { ...TIMER_NOTIFICATION_DEFAULT },
          ],
        ),
      ),
    ),
    [QUEST_ALERT_NOTIFICATION_ID]: {
      enabled: true,
      sound: null,
      icon: null,
      stay: false,
    },
  }

  /**
   * このType/Triggerの通知を有効にするかどうか
   */
  public enabled: boolean = true;

  /**
   * このType/Triggerの通知音のURL
   * nullの場合、default.soundが使われる
   * default.soundもnullの場合、通知音は鳴らされない
   */
  public sound: string | null = null;

  /**
   * このType/Triggerの通知アイコンのURL
   * nullの場合、default.iconが使われる
   * default.iconもnullの場合、通知アイコンはデフォルトのものが使われる
   */
  public icon: string | null = null;

  /**
   * この通知が画面に表示され続けるかどうか
   * trueの場合、ユーザーが手動で閉じるまで表示され続ける
   * falseの場合、一定時間後に自動的に閉じられる
   */
  public stay: boolean = false;

  /**
   * NotificationConfigを $n.id 形式から取得する
   * $n.id 形式の例: /shipbuild/start/1
   * @param id
   * @returns 指定されたIDに対応するNotificationConfigを返す
   */
  public static async get(id: string): Promise<NotificationConfigData> {
    const parsed = NotificationId.parse(id);
    const triggerKey = (Object.values(TriggerType) as string[]).includes(parsed?.trigger ?? "")
      ? parsed!.trigger as TriggerType
      : TriggerType.END;
    const configKey = parsed ? NotificationId.configKey(parsed.type, triggerKey) : null;
    const config = configKey ? await this.find(configKey) as NotificationConfig | null : null;
    const def = (await this.user(triggerKey))!;
    return {
      enabled: config?.enabled ?? def.enabled,
      sound: config?.sound ?? def.sound,
      icon: config?.icon ?? def.icon,
      stay: config?.stay ?? def.stay,
    };
  }

  /**
   * この設定レコードの _id から type セグメントを取り出す（例: /shipbuild/start → "shipbuild"）。
   * 解析できない場合は UNKNOWN。
   */
  public get type(): string {
    return NotificationId.parse(this._id ?? "")?.type ?? EntryType.UNKNOWN;
  }

  /**
   * この設定レコードの _id から trigger セグメントを取り出す。
   * TriggerType の値でない場合は END にフォールバックする。
   */
  public get trigger(): TriggerType {
    const trigger = NotificationId.parse(this._id ?? "")?.trigger;
    return (Object.values(TriggerType) as string[]).includes(trigger ?? "")
      ? trigger as TriggerType
      : TriggerType.END;
  }

  public static async user(trigger: TriggerType = TriggerType.START): Promise<NotificationConfig> {
    return (await this.find(`/default/${trigger}`))!;
  }

}
