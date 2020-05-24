
export default class NotificationService {

  private n: typeof chrome.notifications;

  constructor(mod = chrome) {
    this.n = mod.notifications;
  }

  create(id: string, opt: chrome.notifications.NotificationOptions) {
    return new Promise(resolve => {
      this.n.create(id, opt, (created) => resolve(created));
    });
  }

  clear(id: string): Promise<boolean> {
    return new Promise(resolve => {
      this.n.clear(id, (cleared) => {
        resolve(cleared);
      });
    });
  }

}
