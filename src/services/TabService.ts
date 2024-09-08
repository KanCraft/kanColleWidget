
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
}