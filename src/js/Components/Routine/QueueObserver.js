import {ScheduledQueues} from "../Models/Queue/Queue";
import Config from "../Models/Config";
import Assets from "../Services/Assets";
// import {Logger} from "chomex";
// const logger = new Logger();

import {MISSION, RECOVERY, CREATESHIP, TIREDNESS} from "../../Constants";

import BadgeService from "../Services/BadgeService";
import NotificationService from "../Services/NotificationService";

export default class QueueObserver {
    constructor(accessor = ScheduledQueues, storage = localStorage) {
        this.accessor = accessor;
        this.storage = storage;
        this.badge = new BadgeService();
        this.notification = new NotificationService();
        this.assets = new Assets(Config);
    }

    static instance = null;
    static interval = null;
    static getInstance(storage = localStorage) {
        if (!QueueObserver.instance) {
            QueueObserver.instance = new QueueObserver(ScheduledQueues, storage);
        }
        return QueueObserver.instance;
    }
    static start(duration = 5 * 1000) {
        const instance = QueueObserver.getInstance();
        QueueObserver.interval = setInterval(() => {
            instance.run();
        }, duration);
    }
    static kill() {
        clearInterval(QueueObserver.interval);
    }

  /**
   * ScheduledQueuesからいろいろあれする
   */
    run(now = Date.now()) {

        // FIXME: 表記ゆれの名残。"~複数形"のほうはいずれ消す。
        let missions = this.accessor.find(MISSION)       || this.accessor.find("missions");
        let recoveries = this.accessor.find(RECOVERY)    || this.accessor.find("recoveries");
        let createships = this.accessor.find(CREATESHIP) || this.accessor.find("createships");
        let tiredness   = this.accessor.find(TIREDNESS)  || this.accessor.find("tiredness");

        const timeups = [
            ...missions.scan(now),
            ...recoveries.scan(now),
            ...createships.scan(now),
            ...tiredness.scan(now),
        ];

        timeups.map(queue => {
            this.notification.create(
              queue.toNotificationID(),
              queue.toNotificationParams()
            );
            this.assets.playSoundIfSet(queue.params.type);
        });

        // clean up
        missions.save();
        recoveries.save();
        createships.save();
        tiredness.save();

        this.badge.update([
            ...missions.queues,
            ...recoveries.queues,
            ...createships.queues
        ]);
    }

}
