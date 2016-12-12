import {Model} from "chomex";

// TODO: いやーこれ設計崩壊してるだろ
import Config from "../Config";
import Assets from "../../Services/Assets";

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
    // get only
    static dict() {
        let dict = {};
        let all = this.all();
        for (let key in all) {
            dict[key] = Array(4).fill({});
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
    tiredness: {
        queues: [],
    }
};

export class Queue {
    constructor(scheduledTimeStamp, params) {
        this.scheduled = scheduledTimeStamp;
        this.params = params;
    }
    hasCome(now = Date.now()) {
        return ((parseInt(this.scheduled) - now) <= 0);
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
}

// これがここにあるからややこしいことになってる
function createQueueModelFromStorage(stored) {
    switch(stored.params.type) {
    case "mission":
        return Mission.createFromStorage(stored);
    case "recovery":
        return Recovery.createFromStorage(stored);
    case "createship":
        return CreateShip.createFromStorage(stored);
    default:
    }
}

/* 遠征のqueueのやつ */
export class Mission extends Queue {
    constructor(time, title, deck, mission) {
        const params = {
            type: "mission",
            title: title,
            deck: deck,
            mission: mission,
        };
        super(time, params);
        this.title = title;
        this.deck  = deck;
        this.badgeColor = "#0fabb1";
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
        const url = chrome.extension.getURL("dest/img/icons/chang.white.png");
        return {
            toNotificationID: () => "mission.unknown",
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
        return `mission.${this.params.mission}`;
    }

    toNotificationParams() {
        // TODO: ここでchrome参照するのぜったいいや
        const url = chrome.extension.getURL("dest/img/icons/chang.white.png");
        return {
            type: "basic",
            title: `遠征帰投報告: ${this.title}`,
            message: `第${this.deck}艦隊がまもなく「${this.title}」より帰投します`,
            requireInteraction: true,
            iconUrl: url,
        };
    }

    // 遠征開始時のNotification用パラメータ
    toNotificationParamsForStart() {
        // TODO: ここでchrome参照するのぜったいいや
        const url = chrome.extension.getURL("dest/img/icons/chang.white.png");
        return {
            type: "basic",
            title: `遠征艦隊出港: ${this.title}`,
            message: `第${this.deck}艦隊が「${this.title}」へ向かいました。帰投予定時刻は${(new Date(this.scheduled)).toClockString()}です。`,
            requireInteraction: false,
            iconUrl: url,
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
            type: "recovery",
            dock: dock,
        };
        super(time, params);
        this.dock = dock;
        this.detected = detected;
        this.badgeColor = "#5b84ff";
    }
    toNotificationID() {
        return `recovery.${this.dock}`;
    }
    toNotificationParams() {
        // (´ε｀；)ｳｰﾝ…ここでchrome参照...
        // TODO: ここでchrome参照するのぜったいいや
        // TODO: AssetManagerの実装が必要だー
        // (new AssetManager(configset)).getNotificationIconURIForType("recovery")
        // 的なやつ
        // configsetが持って無ければデフォルト、とかそういうロジックを持っているやつ
        const url = chrome.extension.getURL("dest/img/icons/chang.white.png");
        return {
            type: "basic",
            title: `修復終了報告: ${this.dock}番ドック`,
            message: `第${this.dock}番ドックの修復がまもなく終了します。`,
            requireInteraction: true,
            iconUrl: url,
        };
    }
    toNotificationParamsForStart() {
        // (´ε｀；)ｳｰﾝ…ここでchrome参照...
        // TODO: AssetManagerの実装が必要だー
        const url = chrome.extension.getURL("dest/img/icons/chang.white.png");
        return {
            type: "basic",
            title: `おやすみします ${("h" in this.detected) ? this.detected.h + "時間" + this.detected.m + "分" : ""}`,
            message: `第${this.dock}ドックでおやすみします。修復完了予定時刻は${(new Date(this.scheduled)).toClockString()}です。`,
            requireInteraction: false,
            iconUrl: url,
        };
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
            type: "createship",
            dock: dock,
        };
        super(time, params);
        this.dock = dock;
        this.detected = detected;
        this.badgeColor = "#5b84ff";
    }
    toNotificationID() {
        return `createship.${this.dock}`;
    }
    toNotificationParams() {
        const url = chrome.extension.getURL("dest/img/icons/chang.white.png");
        return {
            type: "basic",
            title: `建造終了報告: ${this.dock}番建造ドック`,
            message: `第${this.dock}番ドックの建造がまもなく終了します。`,
            requireInteraction: true,
            iconUrl: url,
        };
    }
    toNotificationParamsForStart() {
        // (´ε｀；)ｳｰﾝ…ここでchrome参照...
        // TODO: AssetManagerの実装が必要だー
        const url = chrome.extension.getURL("dest/img/icons/chang.white.png");
        return {
            type: "basic",
            title: `建造所要時間 ${("h" in this.detected) ? this.detected.h + "時間" + this.detected.m + "分" : ""}`,
            message: `第${this.dock}ドックでの建造完了予定時刻は${(new Date(this.scheduled)).toClockString()}です。`,
            requireInteraction: false,
            iconUrl: url,
        };
    }
    static createFromStorage(stored) {
        return new this(stored.scheduled, stored.params.dock);
    }
}

export class Tiredness extends Queue {
    constructor(time, deck) {
        const params = {
            type: "tiredness",
            deck: deck,
        };
        super(time, params);
        this.deck = deck;
        this.badgeColor = "#5b84ff";
    }

    toNotificationID() {
        return `tiredness.${this.deck}`;
    }
    toNotificationParams() {
        const assets = new Assets(Config);
        return {
            type: "basic",
            title: "疲労回復",
            message: `第${this.deck}艦隊の疲労がだいたい回復しそうです`,
            requireInteraction: true,
            iconUrl: assets.getNotificationIcon("tiredness"),
        };
    }
    toNotificationParamsForStart() {
        return {};
    }
    static createFromStorage(stored) {
        return new this(stored.scheduled, stored.params.deck);
    }
  }
