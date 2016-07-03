
class NotificationService {
  constructor(mod = chrome.notifications) {
    this.module = mod;
  }

  create(id, options) {
    return new Promise(resolve => {
      this.module.create(id, options, resolve);
    });
  }

  clear(id) {
    return new Promise(resolve => {
      this.module.clear(id, resolve);
    });
  }
}

export default NotificationService;
