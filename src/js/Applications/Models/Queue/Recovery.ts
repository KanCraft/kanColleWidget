import Queue, { Scanned, Kind } from "./Queue";

export default class Recovery extends Queue {

  static __ns = Kind.Recovery;

  static offset = 1000 * 60; // 1分前通知とかいうやつ

  static scan(clean = true): Scanned<Recovery> {
    return super._scan<Recovery>(Recovery, Date.now(), clean);
  }

  dock: number | string;
  time: number;
  text: string;

  register(scheduled: number): Recovery {
    return super._register<Recovery>(scheduled - Recovery.offset);
  }

  registeredOn(dock: number | string) {
    return this.dock == dock;
  }

  notificationOption(): chrome.notifications.NotificationOptions {
    return {
      title: "修復完了",
      message: `間もなく、第${this.dock}ドックの修復が完了します`,
      requireInteraction: true,
    };
  }

  notificationOptionOnRegister(): chrome.notifications.NotificationOptions {
    return {
      iconUrl: this.defaultIconURL,
      message: `第${this.dock}ドックに艦娘が入渠します。修復予定時刻は${(new Date(this.scheduled)).toLocaleTimeString()}です。`,
      requireInteraction: false,
      title: "修復開始",
      type: "basic",
    };
  }

  // TODO: これはViewに持ってったほうがいいだろ〜
  getQueueTypeLabel() {
    return "修復";
  }

  getTimerLabel() {
    return `第${this.dock}ドック 修復`;
  }
}
