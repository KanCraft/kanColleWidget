import Queue, { Scanned } from "./Queue";

import * as catalog from "./missions.json";

/**
 * 遠征のモデル
 */
export default class Mission extends Queue {

  /**
   * 遠征IDからMissionモデルを作成する
   * @param id 遠征ID
   */
  public static for(id: number | string, deck: number | string): Mission {
    const definition = catalog[id];
    if (! definition) {
      return null;
    }
    return Mission.new({...definition, id, deck});
  }

  public static scan(): Scanned<Mission> {
    return super._scan<Mission>(Mission, Date.now());
  }

  public id: number | string; // 遠征ID
  public deck: number | string; // 艦隊ID [2,3,4]
  public title: string; // 遠征タイトル
  public time: number; // 所要時間（ミリ秒）

  /**
   * Missionモデルインスタンスを、終了予定時刻を作成しつつ
   * ストレージに登録する
   */
  public register(): Mission {
    const scheduled = Date.now() + this.time;
    return super._register(scheduled);
  }

  public notificationOption(): chrome.notifications.NotificationOptions {
    return {
      iconUrl: "https://github.com/otiai10/kanColleWidget/blob/develop/dest/img/icons/chang.128.png?raw=true",
      message: `間もなく、第${this.deck}艦隊が${this.title}より帰投します`,
      requireInteraction: true,
      title: "遠征帰投",
      type: "basic",
    };
  }

  public notificationOptionOnRegister(): chrome.notifications.NotificationOptions {
    return {
      iconUrl: "https://github.com/otiai10/kanColleWidget/blob/develop/dest/img/icons/chang.128.png?raw=true",
      message: `第${this.deck}艦隊が、${this.title}に向けて出港しました。帰投予定時刻は${(new Date(this.scheduled)).toLocaleTimeString()}です。`,
      requireInteraction: false,
      title: "遠征出港",
      type: "basic",
    };
  }
}
