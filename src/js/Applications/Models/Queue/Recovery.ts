import Queue, { Scanned } from "./Queue";

export default class Recovery extends Queue {

  static __ns = "Recovery";

  static scan(): Scanned<Recovery> {
    return super._scan<Recovery>(Recovery, Date.now());
  }

  dock: number | string;
  time: number;
  text: string;

  register(scheduled: number): Recovery {
    return super._register<Recovery>(scheduled);
  }

  notificationOption(): chrome.notifications.NotificationOptions {
    return {
      iconUrl: this.defaultIconURL,
      message: `間もなく、第${this.dock}ドックの修復が完了します`,
      requireInteraction: true,
      title: "修復完了",
      type: "basic",
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
