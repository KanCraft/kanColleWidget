import Frame from "../Applications/Background/Models/Frame";
import Const from "../Constants";

export interface Launched {
  tab: chrome.tabs.Tab;
  frame: Frame;
}

/**
 * chrome.windows, chrome.tabs のサービス
 */
class WindowService {

  public static instance = null;

  public static getInstance(): WindowService {
    if (!WindowService.instance) {
      WindowService.instance = new this();
    }
    return WindowService.instance;
  }

  private tabs: typeof chrome.tabs;
  private windows: typeof chrome.windows;

  // すでに作成されているタブ
  private launched: Launched;

  constructor(mod = chrome) {
    this.tabs = mod.tabs;
    this.windows = mod.windows;
  }

  /**
   * 窓そのものを取得
   */
  public get(winId: number): Promise<chrome.windows.Window> {
    return new Promise(resolve => {
      this.windows.get(winId, (win) => {
        resolve(win);
      });
    });
  }

  /**
   * すでに艦これのゲーム窓が開いていればそれを取得する
   * @param strict ゲーム窓が無い場合、Promiseをrejectする
   * @param query デフォルトでは艦これのゲーム窓を探すqueryになっている
   */
  public find(strict: boolean = false, query: chrome.tabs.QueryInfo = {
    url: Const.KanColleURL,
  }): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      this.tabs.query(query, (tabs: chrome.tabs.Tab[]) => {
        if (strict && tabs.length === 0) {
          return reject();
        }
        return resolve(tabs[0]);
      });
    });
  }

  /**
   * 窓の設定を受け取り、新しく窓をつくる
   */
  public create(frame: Frame): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      this.windows.create(frame.createData(), (win) => {
        this.launched = {
          frame,
          tab: win.tabs[0],
        };
        resolve(this.launched.tab);
      });
    });
  }

  /**
   * 窓の設定を変える
   */
  public update(tab: chrome.tabs.Tab, info: chrome.windows.UpdateInfo): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => {
      this.windows.update(tab.windowId, info, (win) => {
        resolve(tab);
      });
    });
  }

  /**
   * 与えられたFrame情報で今開いているタブを更新する
   */
  public async reconfigure(tab: chrome.tabs.Tab, frame: Frame): Promise<chrome.tabs.Tab> {
    const data: chrome.windows.CreateData = frame.createData();
    const info: chrome.windows.UpdateInfo = {
      focused: true,
      height: data.height,
      width: data.width,
    };
    tab = await this.update(tab, info);
    tab = await this.zoom(tab, frame.zoom);
    return tab;
  }

  /**
   * 窓のズーム値を変える
   */
  public zoom(tab: chrome.tabs.Tab, zoom: number): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => {
      this.tabs.setZoom(tab.id, zoom, () => {
        resolve(tab);
      });
    });
  }

  /**
   * このサービス経由でLaunchされたタブかどうか返す
   * @param tabId
   */
  public knows(tabId: number): Launched {
    return this.launched.tab.id === tabId ? this.launched : null;
  }

}

export default WindowService;
