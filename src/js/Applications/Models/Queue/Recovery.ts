import Queue, { Scanned } from "./Queue";

export default class Recovery extends Queue {

  public static scan(): Scanned<Recovery> {
    return super._scan<Recovery>(Recovery, Date.now());
  }

  public dock: number | string;
  public time: number;
  public text: string;

  public register(scheduled: number): Recovery {
    return super._register<Recovery>(scheduled);
  }

  public notificationOption(): chrome.notifications.NotificationOptions {
    return {
      iconUrl: "https://github.com/otiai10/kanColleWidget/blob/develop/dest/img/icons/chang.128.png?raw=true",
      message: `間もなく、第${this.dock}ドックの修復が完了します`,
      requireInteraction: true,
      title: "修復完了",
      type: "basic",
    };
  }

}
