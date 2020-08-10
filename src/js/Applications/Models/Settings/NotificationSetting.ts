import { Model, Types } from "chomex";
import { Kind } from "../Queue/Queue";
import Shipbuilding from "../Queue/Shipbuilding";
import Tiredness from "../Queue/Tiredness";
import Recovery from "../Queue/Recovery";
import Mission from "../Queue/Mission";

export default class NotificationSetting extends Model {

  static __ns = "NotificationSetting";

  static defaultIcon = chrome.extension.getURL("dest/img/app/icon.128.png");

  enabled: boolean; // そもそも通知を出すかどうか
  icon: string; // icon URL
  sound: string; // sound URL
  volume?: number; // 音声のボリューム

  start: {
    title: string;
    message: string;
  };
  finish: {
    title: string;
    message: string;
  };


  static schema = {
    enabled: Types.bool,
    icon: Types.string,
    sound: Types.string,
    volume: Types.number,
    start: Types.shape({
      title: Types.string,
      message: Types.string,
    }),
    finish: Types.shape({
      title: Types.string,
      message: Types.string,
    }),
  }

  static default: {
    [id: string]: {
      enabled: boolean, icon?: string, sound?: string,
      volume?: number,
      start?: { title: string, message: string },
      finish?: { title: string, message: string },
    }
  } = {
    // なんも設定されてないときに使うやつ
    "default": {
      enabled: true,
      icon: "",
      sound: "",
    },
    // 遠征の通知設定
    [Kind.Mission]: {
      enabled: true,
      start: {
        title: "遠征出港",
        message: "第{0}艦隊が、{1}に向けて出港しました。帰投予定時刻は{2}です。"
      },
      finish: {
        title: "遠征帰投",
        message: "間もなく、第{0}艦隊が{1}より帰投します",
      }
    },
    // 修復の通知設定
    [Kind.Recovery]: {
      enabled: true,
      start: {
        title: "修復開始",
        message: "第{0}ドックに艦娘が入渠します。修復予定時刻は{1}です。",
      },
      finish: {
        title: "修復完了",
        message: "間もなく、第{0}ドックの修復が完了します",
      },
    },
    // 建造の通知設定
    [Kind.Shipbuilding]: {
      enabled: true,
      start: {
        title: "建造開始",
        message: "第{0}ドックでの建造を開始します。建造予定時刻は{1}です。",
      },
      finish: {
        title: "建造完了",
        message: "間もなく、第{0}ドックの建造が完了します",
      },
    },
    // 疲労の通知設定
    [Kind.Tiredness]: {
      enabled: true,
      start: {
        title: "出撃開始",
        message: "第{0}艦隊が出撃しました。",
      },
      finish: {
        title: "疲労回復",
        message: "間もなく、第{0}艦隊の疲労が回復する見込みです",
      },
    },
  }

  getFileSystemIconPath() {
    return `notification_icon_${this._id}`;
  }
  getFileSystemSoundPath() {
    return `notification_sound_${this._id}`;
  }

  getSound(): { url: string, volume: number } | undefined {
    const def = NotificationSetting.find<NotificationSetting>("default");
    if (this.sound) return { url: this.sound, volume: def.volume || 0.5 };
    if (def.sound) return { url: def.sound, volume: def.volume || 0.5 };
    return;
  }

  getIcon(): string {
    const def = NotificationSetting.find<NotificationSetting>("default");
    return this.icon || def.icon || NotificationSetting.defaultIcon;
  }

  getChromeOptions(queue: Mission | Recovery | Shipbuilding | Tiredness, finish = true): chrome.notifications.NotificationOptions {
    const opt: chrome.notifications.NotificationOptions = {
      iconUrl: this.getIcon(), type: "basic",
      requireInteraction: finish, // 終了時は常にrequiredInteractionとする
    };
    const tpl = this.getTextTemplate(queue.kind(), finish);
    if (queue.constructor === Mission) {
      opt.title = tpl.title;
      opt.message = tpl.message.format(queue.deck, queue.title, (new Date(queue.scheduled)).toKCWTimeString());
    } else if (queue.constructor == Recovery) {
      opt.title = tpl.title;
      opt.message = tpl.message.format(queue.dock, (new Date(queue.scheduled)).toKCWTimeString());
    } else if (queue.constructor == Shipbuilding) {
      opt.title = tpl.title;
      opt.message = tpl.message.format(queue.dock, (new Date(queue.scheduled)).toKCWTimeString());
    } else if (queue.constructor == Tiredness) {
      opt.title = tpl.title;
      opt.message = tpl.message.format(queue.deck, (new Date(queue.scheduled)).toKCWTimeString());
    }
    return opt;
  }

  private getTextTemplate(kind: Kind, finish: boolean): { title: string, message: string } {
    if (finish) {
      if (this.finish) return this.finish;
      const def = NotificationSetting.default[kind];
      if (def.finish) return this.finish;
    } else {
      if (this.start) return this.start;
      const def = NotificationSetting.default[kind];
      if (def.start) return def.start;
    }
    return { title: "[INFO] UNHANDLED", message: `通知詳細設定がありません: ${kind}/${finish}` };
  }
}