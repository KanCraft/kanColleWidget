import {Model} from "chomex";

import {greenA400, blueA700, orange600} from "material-ui/styles/colors";

// TODO: いやーこれ設計崩壊してるだろ
import Config from "../Config";
import Assets from "../../../Services/Assets";
import {MISSION,RECOVERY,CREATESHIP,TIREDNESS} from "../../../Constants";


import catalog from "./missions.json";

// TODO: ファイルいい感じに分割せねばな
const msec = 1000,
  S = 1 * msec,
  M = 60 * S,
  H = 60 * M;

export class ScheduledQueues extends Model {
  static append(type, queue) {
    if (queue.scheduled == null) return;
    let instance = this.find(type);
    let queues = instance.queues.filter(q => (q.deck || q.dock) != (queue.deck || queue.dock));
    queues.push(queue);
    instance.queues = queues;
    return instance.save();
  }
  static remove(type, identifier) {
    let instance = this.find(type);
    instance.queues = instance.queues.filter(q => (q.deck || q.dock) != identifier);
    return instance.save();
  }
    // get only
  static dict() {
    let dict = {};
    let all = this.all();
    for (let key in all) {
      dict[key] = Array(4).fill({type:key});
      for (let i = 0; i < dict[key].length; i++) {
        dict[key][i] = {type:key, deck: i + 1, dock: i + 1};
      }
      all[key].queues.map(q => {
        dict[key][parseInt(q.deck || q.dock) - 1] = q;
      });
    }
    return dict;
  }

  /**
   * 終わってるやつを返して、自分からは削除する
   * ついでに予定が近い順に並べる
   */
  scan(now = Date.now()) {
    let timeup = [], notyet = [];
    this.queues.map(q => {
      if (!q) return;
      const qm = createQueueModelFromStorage(q);
      if (!qm) return;
      // console.log(qm);

      if (q.scheduled - now <= 0) timeup.push(qm);
      else  notyet.push(qm);
    });
    this.queues = notyet.sort((prev, next) => {
      return next.scheduled < prev.scheduled;
    });
    return timeup;
  }
  clear(identifier) {
    this.queues = this.queues.filter(q => {
      if ((q.params.deck || q.params.dock) == identifier) return false;
      return true;
    });
    this.save();
  }
}

ScheduledQueues.default = {
  [MISSION]: {
    queues: [],
  },
  [RECOVERY]: {
    queues: [],
  },
  [CREATESHIP]: {
    queues: [],
  },
  [TIREDNESS]: {
    queues: [],
  }
};

export class Queue {
  constructor(scheduledTimeStamp, params) {
    this.scheduled = scheduledTimeStamp;
    this.params = params;
    this.assets = new Assets(Config);
  }
  hasCome(now = Date.now()) {
    return ((parseInt(this.scheduled) - now) <= 0);
  }
  isValid() {
    return !isNaN(new Date(this.scheduled));
  }
  // Override me
  toBadgeParams() {
    const diff = this.scheduled - Date.now();
    if (diff < 1*M) {
      return {text: "0", color: this.badgeColor};
    }
    if (diff < 1*H) {
      return { text: Math.floor(diff / (1*M)) + "m", color: this.badgeColor };
    }
    return { text: Math.floor(diff / (1*H)) + "h+", color: this.badgeColor };
  }
  requireInteractionFor(key) {
    return Config.find("notification-stay-visible")[key];
  }
}

// これがここにあるからややこしいことになってる
function createQueueModelFromStorage(stored) {
  switch(stored.params.type) {
  case MISSION:
    return Mission.createFromStorage(stored);
  case RECOVERY:
    return Recovery.createFromStorage(stored);
  case CREATESHIP:
    return CreateShip.createFromStorage(stored);
  case TIREDNESS:
    return Tiredness.createFromStorage(stored);
  default:
  }
}

/* 遠征のqueueのやつ */
export class Mission extends Queue {
  constructor(time, title, deck, mission) {
    const params = {
      type: MISSION,
      title: title,
      deck: deck,
      mission: mission,
    };
    super(time, params);
    this.title = title;
    this.deck  = deck;
    this.badgeColor = blueA700;
  }

  static dummy() {
    return this.createFromFormData({
      api_deck_id: [0],
      api_mission_id: ["-1"]
    });
  }

  static createFromFormData(data) {
    try {
      const deck = parseInt(data["api_deck_id"][0]);
      const mission = parseInt(data["api_mission_id"][0]);
      const {title, time} = Mission.catalog[mission];
      const scheduled = Date.now() + time - 1*M;//1分早いのである
      return new this(scheduled, title, deck, mission);
    } catch (err) {
      return this.unknown(parseInt(data["api_mission_id"][0]));
    }
  }
  static unknown(missionID) {
    const url = (new Assets(Config)).getDefaultIcon();
    return {
      toNotificationID: () => `${MISSION}.unknown`,
      toNotificationParamsForStart: () => {
        return {
          type: "basic",
          title: "遠征艦隊出港",
          message: `遠征ID${missionID}？ 知らない子ですね`,
          requireInteraction: false,
          iconUrl: url,
          buttons: [{title: `GitHubで遠征ID${missionID}を追加する`,iconUrl:"https://assets-cdn.github.com/favicon.ico"}],
        };
      }
    };
  }
  static createFromStorage(stored) {
    const {title, /* time */} = Mission.catalog[stored.params.mission];
    return new this(stored.scheduled, title, stored.params.deck, stored.params.mission);
  }

  toNotificationID() {
    return `${MISSION}.${this.params.mission}`;
  }

  toNotificationParams() {
    return {
      type: "basic",
      title: `遠征帰投報告: ${this.title}`,
      message: `第${this.deck}艦隊がまもなく「${this.title}」より帰投します`,
      requireInteraction: this.requireInteractionFor("onfinish"),
      iconUrl: this.assets.getNotificationIcon(MISSION),
    };
  }

  // 遠征開始時のNotification用パラメータ
  toNotificationParamsForStart() {
    return {
      type: "basic",
      title: `遠征艦隊出港: ${this.title}`,
      message: `第${this.deck}艦隊が「${this.title}」へ向かいました。帰投予定時刻は${(new Date(this.scheduled)).toClockString()}です。`,
      requireInteraction: this.requireInteractionFor("onstart"),
      iconUrl: this.assets.getNotificationIcon(MISSION),
    };
  }
}

Mission.catalog = catalog;

/**
 * 修復のやつ
 */
export class Recovery extends Queue {
  constructor(time, dock, detected = {}) {
    const params = {
      type: RECOVERY,
      dock: dock,
    };
    super(time, params);
    this.dock = dock;
    this.detected = detected;
    this.badgeColor = greenA400;
  }
  toNotificationID() {
    return `${RECOVERY}.${this.dock}${this.isValid() ? "" : ".failed"}`;
  }
  toNotificationParams() {
    return {
      type: "basic",
      title: `修復終了報告: ${this.dock}番ドック`,
      message: `第${this.dock}番ドックの修復がまもなく終了します。`,
      requireInteraction: this.requireInteractionFor("onfinish"),
      iconUrl: this.assets.getNotificationIcon(RECOVERY),
    };
  }
  toNotificationParamsForStart() {
    if (this.isValid()) {
      return {
        type: "basic",
        title: `おやすみします ${("h" in this.detected) ? this.detected.h + "時間" + this.detected.m + "分" : ""}`,
        message: `第${this.dock}ドックでおやすみします。修復完了予定時刻は${(new Date(this.scheduled)).toClockString()}です。`,
        requireInteraction: this.requireInteractionFor("onstart"),
        iconUrl: this.assets.getNotificationIcon(RECOVERY),
      };
    } else {
      return {
        type: "basic",
        title: "修復時間の取得に失敗しました",
        message: `第${this.dock}ドックの修復時間取得に失敗しました。OCRを使用しているため、画面が小さすぎたりすると失敗します。以下のボタンから手動登録することも可能です。`,
        requireInteraction: true,
        iconUrl: this.assets.errorIcon(),
        buttons: [{title:"手動登録する"}]
      };
    }
  }
  static createFromStorage(stored) {
    return new this(stored.scheduled, stored.params.dock);
  }
}

/**
 * 建造のやつ
 */
export class CreateShip extends Queue {
  constructor(time, dock, detected = {}) {
    const params = {
      type: CREATESHIP,
      dock: dock,
    };
    super(time, params);
    this.dock = dock;
    this.detected = detected;
    this.badgeColor = orange600;
  }
  toNotificationID() {
    return `${CREATESHIP}.${this.dock}`;
  }
  toNotificationParams() {
    return {
      type: "basic",
      title: `建造終了報告: ${this.dock}番建造ドック`,
      message: `第${this.dock}番ドックの建造がまもなく終了します。`,
      requireInteraction: this.requireInteractionFor("onfinish"),
      iconUrl: this.assets.getNotificationIcon(CREATESHIP),
    };
  }
  toNotificationParamsForStart() {
    return {
      type: "basic",
      title: `建造所要時間 ${("h" in this.detected) ? this.detected.h + "時間" + this.detected.m + "分" : ""}`,
      message: `第${this.dock}ドックでの建造完了予定時刻は${(new Date(this.scheduled)).toClockString()}です。`,
      requireInteraction: this.requireInteractionFor("onstart"),
      iconUrl: this.assets.getNotificationIcon(CREATESHIP),
    };
  }
  static createFromStorage(stored) {
    return new this(stored.scheduled, stored.params.dock);
  }
}

export class Tiredness extends Queue {
  constructor(time, deck) {
    const params = {
      type: TIREDNESS,
      deck: deck,
    };
    super(time, params);
    this.deck = deck;
    this.badgeColor = "#5b84ff";
  }
  _getNotificationMessage() {
    if (this.deck < 5) {
      return `第${this.deck}艦隊の疲労がだいたい回復しそうです`;
    }
    const d = new Date(this.deck);
    return `${d.toClockString()}出撃編成の疲労がたいたい回復しそうです`;
  }
  toNotificationID() {
    return `${TIREDNESS}.${this.deck}`;
  }
  toNotificationParams() {
    return {
      type: "basic",
      title: "疲労回復",
      message: this._getNotificationMessage(),
      requireInteraction: this.requireInteractionFor("onfinish"),
      iconUrl: this.assets.getNotificationIcon(TIREDNESS),
    };
  }
  toNotificationParamsForStart() {
    return {};
  }
  static createFromStorage(stored) {
    return new this(stored.scheduled, stored.params.deck);
  }
}
