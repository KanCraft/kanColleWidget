import {ScheduledQueues} from "../Models/Queue/Queue";
import Config from "../Models/Config";
import Assets from "../Services/Assets";
// import {Logger} from "chomex";
// const logger = new Logger();

import {MISSION, RECOVERY, CREATESHIP, TIREDNESS} from "../../Constants";

import BadgeService from "../Services/BadgeService";
import NotificationService from "../Services/NotificationService";

class StrictMissionManager {
  constructor(config, notification, accessor, cap = 12) {
    this.config = config;
    this.notification = notification;
    this.accessor = accessor;
    this.cap = cap;
    this.counter = 0;
  }
  check() {
    if (this.counter < this.cap) return this.counter += 1;
    this.counter = 0;
    const config = this.config.find("strict-mission-rotation");
    if (config.value != "notification") return;
    if (this.accessor.find(MISSION).queues.filter(q => q.scheduled).length != 3) {
      this.notification.create("strict-mission-warning", {
        type: "basic",
        title: "遠征強化令が発令中です",
        message: "遠征帰投から回収されていない艦隊か、次の遠征へ出港していない艦隊があります。早急に次の遠征の指示をお願いいたします",
        iconUrl: (new Assets(Config)).getDefaultIcon(),
        requireInteraction: true,
      });
    }
  }
}

export default class QueueObserver {
  constructor(accessor = ScheduledQueues, storage = localStorage) {
    this.accessor = accessor;
    this.storage = storage;
    this.badge = new BadgeService();
    this.notification = new NotificationService();
    this.assets = new Assets(Config);

    this.strictMissionManager = new StrictMissionManager(Config, this.notification, accessor);
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
      if (Config.find("notification-display").onfinish) this.notification.create(
              queue.toNotificationID(),
              queue.toNotificationParams()
            );
      this.assets.playSoundIfSet(queue.params.type);
    });

    this.strictMissionManager.check();

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
