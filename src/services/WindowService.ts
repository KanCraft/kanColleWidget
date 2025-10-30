
export class WindowService {
  constructor(
        private readonly mod: typeof chrome.windows = chrome.windows,
  ) { }

  public async create(options: chrome.windows.CreateData) {
    return await this.mod.create({ ...options });
  }

  public async update(windowId: number, options: chrome.windows.UpdateInfo) {
    return await this.mod.update(windowId, options);
  }

  public async remove(windowId: number) {
    return await this.mod.remove(windowId);
  }

  public async get(windowId: number, opt: chrome.windows.QueryOptions) {
    return await this.mod.get(windowId, opt);
  }

}