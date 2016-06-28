
export default class BadgeService {
  constructor(config) {
    this.config = config;
  }

  update(queues) {
    queues.sort((prev, next) => { return next.scheduled < prev.scheduled });

    if (queues.length == 0) return this.clear();

    switch(true) {
    default:
      const params = queues[0].toBadgeParams();
      chrome.browserAction.setBadgeText({
        text: params.text
      });
    }
  }

  clear() {
    chrome.browserAction.setBadgeText({text: ''});
  }
}
