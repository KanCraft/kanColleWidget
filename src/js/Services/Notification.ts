
export default class NotificationService {

  private n: typeof chrome.notifications;

  constructor(mod = chrome) {
    this.n = mod.notifications;
  }

  create(id: string, opt: chrome.notifications.NotificationOptions, sound?: string): Promise<string> {
    return new Promise(resolve => {
      this.n.create(id, {type: "basic", ...opt, eventTime: Date.now() + 1}, (created) => resolve(created));
      if (sound) (new Audio(sound)).play();
    });
  }

  clear(id: string): Promise<boolean> {
    return new Promise(resolve => {
      this.n.clear(id, (cleared) => {
        resolve(cleared);
      });
    });
  }

  async clearAll(exp: RegExp): Promise<unknown> {
    const ids = Object.keys(await this.getAll());
    return ids.map(id => {
      return exp.test(id) ? this.clear(id) : Promise.resolve(null);
    });
  }

  getAll(): Promise<Record<string, any>> {
    return new Promise(resolve => {
      this.n.getAll(notifications => resolve(notifications));
    });
  }
}
