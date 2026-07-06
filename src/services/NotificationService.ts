import { NotificationConfig, NotificationConfigData } from "../models/configs/NotificationConfig";
import { Entry, TriggerType } from "../models/entry";
import { SoundPlayer } from "./SoundService";

export class NotificationService {
  constructor(
    private readonly mod: typeof chrome.notifications = chrome.notifications,
    private readonly sound: SoundPlayer = SoundPlayer.shared(),
  ) { }

  public static new() {
    return new this();
  }

  public async get(id: string): Promise<boolean> {
    const all = await this.getAll();
    return all[id];
  }

  public getAll(): Promise<Record<string, boolean>> {
    return new Promise((resolve) => this.mod.getAll(obj => resolve(obj as Record<string, boolean>)));
  }

  public clear(id: string): Promise<boolean> {
    return new Promise((resolve) => this.mod.clear(id, (wasCleared) => resolve(wasCleared)));
  }

  public create(id: string, options: chrome.notifications.NotificationCreateOptions): Promise<string> {
    return new Promise((resolve) => this.mod.create(id, options, (notificationId) => resolve(notificationId)));
  }

  public async notify(entry: Entry, trigger: TriggerType = TriggerType.END): Promise<string> {
    const config = await NotificationConfig.get(entry.$n.id(trigger));
    if (!config.enabled) return "";
    await this.clear(entry.$n.id(trigger));
    await this.create(entry.$n.id(trigger), entry.$n.options(trigger, config));
    await this.sound.play(config.sound);

    // XXX: macOSでは、requireInteractionに関わらずOSの設定に引っ張られるため
    //      stay === false であれば明示的に消すようにする
    //      @see https://github.com/KanCraft/kanColleWidget/blob/develop/spec/features/notification-stay-on-display.md
    if (config.stay === false) {
      setTimeout(() => this.clear(entry.$n.id(trigger)), 10 * 1000);
    }

    return entry.$n.id();
  }

  /**
   * Queue の Entry（艦隊・ドック等の対象を持つ時限通知）に依らない、単発の通知を送る。
   * NotificationConfig の設定（有効/アイコン/通知音/消去方式）は entry 版の notify と共通のものを使う。
   * @param id 通知ID（表示・消去に使う）
   * @param configId NotificationConfig を引く際のID（例: "/quest-alert/start"）
   * @param buildOptions 解決済みの設定から通知オプションを組み立てる
   */
  public async notifyRaw(
    id: string,
    configId: string,
    buildOptions: (config: NotificationConfigData) => chrome.notifications.NotificationCreateOptions,
  ): Promise<string> {
    const config = await NotificationConfig.get(configId);
    if (!config.enabled) return "";
    await this.clear(id);
    await this.create(id, buildOptions(config));
    await this.sound.play(config.sound);

    if (config.stay === false) {
      setTimeout(() => this.clear(id), 10 * 1000);
    }

    return id;
  }
}
