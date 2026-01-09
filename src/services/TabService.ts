
export class TabService {
  constructor(
        private readonly mod: typeof chrome.tabs = chrome.tabs,
  ) { }

  public async query(queryInfo: chrome.tabs.QueryInfo) {
    return await new Promise<chrome.tabs.Tab[]>((resolve) => {
      this.mod.query(queryInfo, (tabs) => {
        resolve(tabs);
      });
    });
  }

  public async get(tabId: number): Promise<chrome.tabs.Tab> {
    return await this.mod.get(tabId);
  }

  public async create(props: chrome.tabs.CreateProperties) {
    return await this.mod.create(props);
  }

  public async update(tabId: number, props: chrome.tabs.UpdateProperties) {
    return await this.mod.update(tabId, props);
  }

  // TODO: 各所で chrome.tabs.captureVisibleTab を使っているので、ここに集約させたい
  public async capture(windowId: number, options: chrome.extensionTypes.ImageDetails) {
    return await new Promise<string>((resolve) => {
      this.mod.captureVisibleTab(windowId, options, (dataUrl) => {
        resolve(dataUrl);
      });
    });
  }
}