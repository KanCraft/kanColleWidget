import { Model, Types } from "chomex";

export default class NotificationSetting extends Model {

  static defaultIcon = chrome.extension.getURL("dest/img/app/icon.128.png");

  enabled: boolean; // そもそも通知を出すかどうか
  icon: string; // icon URL
  sound: string; // sound URL

  static schema = {
    enabled: Types.bool,
    icon: Types.string,
    sound: Types.string,
  }

  static default = {
    // なんも設定されてないときに使うやつ
    "default": {
      enabled: true,
      icon: "",
      sound: "",
    },
    // 遠征の通知設定
    "mission": {
      enabled: true,
    },
    // 修復の通知設定
    "recovery": {
      enabled: true,
    },
    // 建造の通知設定
    "shipbuilding": {
      enabled: true,
    },
    // 疲労の通知設定
    "tiredness": {
      enabled: true,
    },
  }

  getFileSystemIconPath() {
    return `notification_icon_${this._id}`;
  }
  getFileSystemSoundPath() {
    return `notification_sound_${this._id}`;
  }

  getSound(): string | undefined {
    const def = NotificationSetting.find<NotificationSetting>("default");
    return this.sound || def.sound || undefined;
  }

  toChromeOptions(opts: chrome.notifications.NotificationOptions = {}): chrome.notifications.NotificationOptions {
    const def = NotificationSetting.find<NotificationSetting>("default");
    return {
      type: "basic",
      iconUrl: this.icon || def.icon || NotificationSetting.defaultIcon,
      ...opts,
    };
  }
}