import {ScheduledQueues} from '../Models/Queue/Queue';

export default class QueueObserver {
  constructor(accessor = ScheduledQueues, storage = localStorage) {
    this.accessor = accessor;
    this.storage = storage;
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
    console.log(timeups);

    // clean up
    missions.save();
    recoveries.save();
    createships.save();
  }

}
