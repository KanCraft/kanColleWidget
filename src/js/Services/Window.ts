import Const from "../Constants";

/**
 * chrome.windows, chrome.tabs のサービス
 */
class WindowService {

  static instance = null;

  static getInstance() {
    if (!WindowService.instance) {
      WindowService.instance = new this();
    }
    return WindowService.instance;
  }

  private tabs: typeof chrome.tabs;
  private windows: typeof chrome.windows;

  constructor(mod = chrome) {
    this.tabs = mod.tabs;
    this.windows = mod.windows;
  }

  find(strict: boolean = false, query: chrome.tabs.QueryInfo = {
    url: Const.KanColleURL,
  }): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      this.tabs.query(query, (tabs: chrome.tabs.Tab[]) => {
        if (strict && tabs.length == 0) return reject();
        return resolve(tabs[0]);
      });
    });
  }
}

export default WindowService;