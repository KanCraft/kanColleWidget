// TODO: ファイルいい感じに分割せねばな

import {Model} from 'chomex';

const msec = 1000,
      S = 1 * msec,
      M = 60 * S,
      H = 60 * M;

export class ScheduledQueues extends Model {
  static append(type, queue) {
    let instance = this.find(type);
    instance.queues.push(queue);
    return instance.save();
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

      if (q.scheduled - now <= 0) timeup.push(qm);
      else  notyet.push(qm);
    })
    this.queues = notyet.sort((prev, next) => {
      return next.scheduled < prev.scheduled;
    });
    return timeup;
  }
}

ScheduledQueues.default = {
  missions: {
    queues: [],
  },
  recoveries: {
    queues: [],
  },
  createships: {
    queues: [],
  },
};

export class Queue {
  constructor(scheduledTimeStamp, params) {
    this.scheduled = scheduledTimeStamp;
    this.params = params;
  }
  hasCome(now = Date.now()) {
    return ((parseInt(this.scheduled) - now) <= 0);
  }
}

function createQueueModelFromStorage(stored) {
  switch(stored.params.type) {
  case 'mission':
  default:
    return Mission.createFromStorage(stored);
  }
}

/* 遠征のqueueのやつ */
export class Mission extends Queue {
  constructor(time, title, deck, mission) {
    const params = {
      type: 'mission',
      title: title,
      deck: deck,
      mission: mission,
    };
    super(time, params);
    this.title = title;
    this.deck  = deck;
  }

  static dummy() {
    return this.createFromFormData({
      api_deck_id: [0],
      api_mission_id: ['-1']
    });
  }

  static createFromFormData(data) {
    try {
      const deck = parseInt(data['api_deck_id'][0]);
      const mission = parseInt(data['api_mission_id'][0]);
      const {title, time} = Mission.catalog[mission];
      const scheduled = Date.now() + time - 1*M;//1分早いのである
      return new this(scheduled, title, deck, mission);
    } catch (err) {
      // return logger.warn(err);
    }
  }
  static createFromStorage(stored) {
    const {title, time} = Mission.catalog[stored.params.mission];
    return new this(stored.scheduled, title, stored.params.deck, stored.params.mission);
  }

  toNotificationID() {
    return 'xxx';
  }

  toNotificationParams() {
    // TODO: ここでchrome参照するのぜったいいや
    const url = chrome.extension.getURL('dest/img/icons/chang.white.png');
    return {
      type: 'basic',
      title: `遠征帰投報告: ${this.title}`,
      message: `第${this.deck}艦隊がまもなく「${this.title}」より帰投します`,
      requireInteraction: true,
      iconUrl: url,
    };
  }

  toBadgeParams() {
    const diff = this.scheduled - Date.now();
    if (diff < 1*M) {
      return { text: '0' };
    }
    if (diff < 1*H) {
      return { text: Math.floor(diff / (1*M)) + 'm' };
    }
    return { text: Math.floor(diff / (1*H)) + 'h+' };
  }
}

Mission.catalog = {
  "-1": {
    title: "DEBUG: 今すぐのやつ",
    time: 0,
    // time: 10 * M,
  },
  "2": {
    title: "長距離練習航海",
    time: 30 * M
  },
  "5": {
    title: "海上護衛任務",
    time: 1 * H + 30 * M
  },
  "6": {
    title: "防空射撃演習",
    time: 40 * M
  },
  "21": {
    title: "北方鼠輸送作戦",
    time: 2*H + 20*M
  },
  "37": {
    title: "東京急行",
    time: 2 * H + 45 * M
  },
  "38": {
    title: "東京急行２",
    time: 2 * H + 55 * M
  }
}

// const formData = {
//   api_deck_id: ["4"],
//   api_mission_id: ["-1"],
// };
// ScheduledQueues.append('missions', Mission.createFromFormData(formData));
// var missions = ScheduledQueues.find('missions');
