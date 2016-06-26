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
   */
  scan(now = Date.now()) {
    let timeup = [], notyet = [];
    this.queues.map(q => {
      if (!q) return;
      if (q.scheduled - now <= 0) {
        const qm = createQueueModelFromParams(q.params);
        if (qm) return timeup.push(qm);
      }
      return notyet.push(q);
    })
    this.queues = notyet;
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

function createQueueModelFromParams(params) {
  switch(params.type) {
  case 'mission':
  default:
    return Mission.createFromParams(params);
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
  static createFromParams(params) {
    const {title, time} = Mission.catalog[params.mission];
    return new this(time, title, params.deck, params.mission);
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
