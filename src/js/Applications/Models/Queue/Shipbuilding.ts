import Queue, { Scanned } from "./Queue";

export default class Shipbuilding extends Queue {

  public static scan(): Scanned<Shipbuilding> {
    return super._scan<Shipbuilding>(Shipbuilding, Date.now());
  }

  public dock: number | string;
  public time: number;
  public text: string;

  public register(scheduled: number): Shipbuilding {
    return super._register<Shipbuilding>(scheduled);
  }

  public notificationOption(): chrome.notifications.NotificationOptions {
    return {
      iconUrl: "https://github.com/otiai10/kanColleWidget/blob/develop/dest/img/icons/chang.128.png?raw=true",
      message: `間もなく、第${this.dock}ドックの建造が完了します`,
      requireInteraction: true,
      title: "建造完了",
      type: "basic",
    };
  }

}
