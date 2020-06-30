import Queue, { Scanned, Kind } from "./Queue";

import catalog from "./missions";

/**
 * 遠征のモデル
 */
export default class Mission extends Queue {

  static __ns = Kind.Mission;

  static offset = 1000 * 60; // 1分前通知とかいうやつ

  /**
     * 遠征IDからMissionモデルを作成する
     * @param id 遠征ID
     */
  static for(id: number | string, deck: number | string): Mission {
    const definition = catalog[id];
    if (! definition) {
      return null;
    }
    return Mission.new({...definition, id, deck});
  }

  static scan(clean = true): Scanned<Mission> {
    return super._scan<Mission>(Mission, Date.now(), clean);
  }

  id: number | string; // 遠征ID
  deck: number | string; // 艦隊ID [2,3,4]
  title: string; // 遠征タイトル
  time: number; // 所要時間（ミリ秒）

  /**
   * Missionモデルインスタンスを、終了予定時刻を作成しつつ
   * ストレージに登録する
   */
  register(): Mission {
    const scheduled = Date.now() + this.time - Mission.offset;
    return super._register(scheduled);
  }

  registeredOn(deck: number | string) {
    return this.deck == deck;
  }

  notificationOption(): chrome.notifications.NotificationOptions {
    return {
      title: "遠征帰投",
      message: `間もなく、第${this.deck}艦隊が${this.title}より帰投します`,
      requireInteraction: true,
    };
  }

  notificationOptionOnRegister(): chrome.notifications.NotificationOptions {
    return {
      iconUrl: this.defaultIconURL,
      message: `第${this.deck}艦隊が、${this.title}に向けて出港しました。帰投予定時刻は${(new Date(this.scheduled)).toLocaleTimeString()}です。`,
      requireInteraction: false,
      title: "遠征出港",
      type: "basic",
    };
  }

  getQueueTypeLabel() {
    return "遠征";
  }

  getTimerLabel() {
    return `第${this.deck}艦隊 ${this.title}`;
  }
}
