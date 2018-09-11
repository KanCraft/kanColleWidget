/**
 * もしやるなら動画もここでやる
 */
export default class CaptureService {

  private tabs: typeof chrome.tabs;

  constructor(mod = chrome) {
    this.tabs = mod.tabs;
  }

  public base64(winID: number, option: chrome.tabs.CaptureVisibleTabOptions): Promise<string> {
    return new Promise(resolve => {
      this.tabs.captureVisibleTab(winID, option, (dataUrl: string) => {
        resolve(dataUrl);
      });
    });
  }
}
