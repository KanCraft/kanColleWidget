import { NotificationConfig } from "../models/configs/NotificationConfig";
import { Entry, TriggerType } from "../models/entry";
import { sleep } from "../utils";
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

  public create(id: string, options: chrome.notifications.NotificationOptions<true>): Promise<string> {
    return new Promise((resolve) => this.mod.create(id, options, (notificationId) => resolve(notificationId)));
  }

  public async notify(entry: Entry, trigger: TriggerType = TriggerType.END): Promise<string> {
    const config = await NotificationConfig.get(entry.$n.id(trigger));
    if (!config.enabled) return "";
    await this.create(entry.$n.id(trigger), entry.$n.options(trigger, config));
    await this.sound.play(config.sound);
    await sleep(6 * 1000);
    await this.clear(entry.$n.id(trigger));
    return entry.$n.id();
  }
}
