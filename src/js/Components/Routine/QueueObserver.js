import {ScheduledQueues} from '../Models/Queue/Queue';
import {Logger} from 'chomex';
const logger = new Logger();

import BadgeService from '../Services/BadgeService';

export default class QueueObserver {
  constructor(accessor = ScheduledQueues, storage = localStorage) {
    this.accessor = accessor;
    this.storage = storage;
    this.badgeService = new BadgeService();
  }

  static instance = null;
  static interval = null;
  static getInstance(storage = localStorage) {
    if (!QueueObserver.instance) {
      QueueObserver.instance = new QueueObserver(ScheduledQueues, storage)
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

    let missions = this.accessor.find('missions');
    let recoveries = this.accessor.find('recoveries');
    let createships = this.accessor.find('createships');

    const timeups = [
      ...missions.scan(),
      ...recoveries.scan(),
      ...createships.scan(),
    ];

    timeups.map(queue => {
      // TODO: これ、ブラウザのNotificationクラス使う場合もあるし、
      // 音鳴らすみたいなこともあるので
      // やっぱりサービスにしたほうがいい
      chrome.notifications.create(queue.toNotificationParams());
    });

    // clean up
    missions.save();
    recoveries.save();
    createships.save();

    this.badgeService.update([
      ...missions.queues,
      ...recoveries.queues,
      ...createships.queues
    ]);
  }

}
