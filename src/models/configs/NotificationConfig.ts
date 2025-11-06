import { Model } from "jstorm/chrome/local";
import { EntryType, TriggerType } from "../entry";

export interface NotificationConfigData {
  enabled: boolean;
  sound: string | null;
  icon: string | null;
  stay: boolean;
}

export class NotificationConfig extends Model {
  static tableName = "NotificationConfig";
  static override default = {
    "/default/start": {
      enabled: true,
      sound: null,
      icon: chrome.runtime.getURL("icons/128.png"),
      stay: false,
    },
    "/default/end": {
      enabled: true,
      sound: null,
      icon: chrome.runtime.getURL("icons/128.png"),
      stay: false,
    },
    [`/${EntryType.MISSION}/${TriggerType.START}`]: {
      enabled: true,
      sound: null,
      icon: null,
      stay: false,
    },
    [`/${EntryType.MISSION}/${TriggerType.END}`]: {
      enabled: true,
      sound: null,
      icon: null,
      stay: false,
    },
    [`/${EntryType.RECOVERY}/${TriggerType.START}`]: {
      enabled: true,
      sound: null,
      icon: null,
      stay: false,
    },
    [`/${EntryType.RECOVERY}/${TriggerType.END}`]: {
      enabled: true,
      sound: null,
      icon: null,
      stay: false,
    },
    [`/${EntryType.SHIPBUILD}/${TriggerType.START}`]: {
      enabled: true,
      sound: null,
      icon: null,
      stay: false,
    },
    [`/${EntryType.SHIPBUILD}/${TriggerType.END}`]: {
      enabled: true,
      sound: null,
      icon: null,
      stay: false,
    },
    [`/${EntryType.FATIGUE}/${TriggerType.START}`]: {
      enabled: true,
      sound: null,
      icon: null,
      stay: false,
    },
    [`/${EntryType.FATIGUE}/${TriggerType.END}`]: {
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
    const [, type, trigger] = id.split("/");
    const triggerKey = (Object.values(TriggerType) as string[]).includes(trigger ?? "")
      ? trigger as TriggerType
      : TriggerType.END;
    const configKey = type ? `/${type}/${triggerKey}` : null;
    const config = configKey ? await this.find(configKey) as NotificationConfig | null : null;
    const def = (await this.user(triggerKey))!;
    return {
      enabled: config?.enabled ?? def.enabled,
      sound: config?.sound ?? def.sound,
      icon: config?.icon ?? def.icon,
      stay: config?.stay ?? def.stay,
    };
  }

  public static async user(trigger: TriggerType = TriggerType.START): Promise<NotificationConfig> {
    return (await this.find(`/default/${trigger}`))!;
  }

}
