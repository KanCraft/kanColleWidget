// TODO: ファイルいい感じに分割せねばな

import {Model} from 'chomex';

const msec = 1000;
const S = 1 * msec;
const M = 60 * S;
const H = 60 * M;

export class ScheduledQueues extends Model {
  static append(type, queue) {
    let instance = this.find(type);
    instance.queues.push(queue);
    return instance.save();
  }
  check() {
    debugger;
  }
}

ScheduledQueues.default = {
  missions: {
    queues: [],
  },
  recoveries: {
    queues: [],
  },
  createship: {
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

/* 遠征のqueueのやつ */
export class Mission extends Queue {
  constructor(time, title, deck, mission) {
    const params = {
      type: 'mission',
      title: title,
      deck: deck,
      mission: mission,
    };
    super(Date.now() + time, params);
  }
  static createFromFormData(data) {
    try {
      const deck = parseInt(data['api_deck_id'][0]);
      const mission = parseInt(data['api_mission_id'][0]);
      const {title, time} = Mission.catalog[mission];
      return new this(time, title, deck, mission);
    } catch (err) {
      // return logger.warn(err);
    }
  }
}

Mission.catalog = {
  "-1": {
    title: "DEBUG: 今すぐのやつ",
    time: 0,
  },
  "2": {
    title: "長距離練習航海",
    time: 30 * M
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
