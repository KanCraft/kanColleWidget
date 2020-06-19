import Queue, { Scanned } from "./Queue";

export default class Shipbuilding extends Queue {

  static __ns = "Shipbuilding";

  static scan(clean = true): Scanned<Shipbuilding> {
    return super._scan<Shipbuilding>(Shipbuilding, Date.now(), clean);
  }

  dock: number | string;
  time: number;
  text: string;

  register(scheduled: number): Shipbuilding {
    return super._register<Shipbuilding>(scheduled);
  }

  registeredOn(dock: number | string) {
    return this.dock == dock;
  }

  notificationOption(): chrome.notifications.NotificationOptions {
    return {
      iconUrl: this.defaultIconURL,
      message: `間もなく、第${this.dock}ドックの建造が完了します`,
      requireInteraction: true,
      title: "建造完了",
      type: "basic",
    };
  }

  notificationOptionOnRegister(): chrome.notifications.NotificationOptions {
    return {
      iconUrl: this.defaultIconURL,
      message: `第${this.dock}ドックでの建造を開始します。建造予定時刻は${(new Date(this.scheduled)).toLocaleTimeString()}です。`,
      requireInteraction: false,
      title: "建造開始",
      type: "basic",
    };
  }

  getQueueTypeLabel() {
    return "建造";
  }

  getTimerLabel() {
    return `第${this.dock}ドック 建造`;
  }
}
