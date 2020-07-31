import Frame from "../Applications/Models/Frame";
import Const from "../Constants";
import { Client } from "chomex";

export interface Launched {
  tab: chrome.tabs.Tab;
  frame: Frame;
}

/**
 * chrome.windows, chrome.tabs のサービス
 */
class WindowService {

  static instance = null;

  static getInstance(): WindowService {
    if (!WindowService.instance) {
      WindowService.instance = new this();
    }
    return WindowService.instance;
  }

  private tabs: typeof chrome.tabs;
  private windows: typeof chrome.windows;
  private extension: typeof chrome.extension;

  // すでに作成されているタブ
  private launched: Launched;

  constructor(mod = chrome) {
    this.tabs = mod.tabs;
    this.windows = mod.windows;
    this.extension = mod.extension;
  }

  /**
   * 窓そのものを取得
   */
  get(winId: number): Promise<chrome.windows.Window> {
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
  find(strict = false, query: chrome.tabs.QueryInfo = {
    url: Const.KanColleURL,
  }): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      this.tabs.query(query, (tabs: chrome.tabs.Tab[]) => {
        if (strict && tabs.length === 0) {
          return reject("not found");
        }
        return resolve(tabs[0]);
      });
    });
  }

  /**
   * 窓の設定を受け取り、新しく窓をつくる
   */
  create(frame: Frame): Promise<chrome.tabs.Tab> {
    return new Promise((resolve /* , reject */) => {
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
  update(tab: chrome.tabs.Tab, info: chrome.windows.UpdateInfo): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => {
      this.windows.update(tab.windowId, info, (/* win */) => {
        resolve(tab);
      });
    });
  }

  /**
   * 与えられたFrame情報で今開いているタブを更新する
   */
  async reconfigure(tab: chrome.tabs.Tab, frame: Frame): Promise<chrome.tabs.Tab> {
    const data: chrome.windows.CreateData = frame.createData();
    const info: chrome.windows.UpdateInfo = {
      focused: true,
      height: data.height,
      width: data.width,
    };
    return this.update(tab, info);
  }

  /**
   * 窓をフォーカスする
   * @param {chrome.tabs.Tab} tab
   * @param {boolean} focused=true
   */
  async focus(tab: chrome.tabs.Tab, focused = true): Promise<chrome.tabs.Tab> {
    return this.update(tab, { focused });
  }

  /**
   * 窓のズーム値を変える
   */
  zoom(tab: chrome.tabs.Tab, zoom: number): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => {
      this.tabs.setZoom(tab.id, zoom, () => {
        resolve(tab);
      });
    });
  }

  /**
   * 窓のミュートをする
   */
  mute(tab: chrome.tabs.Tab, mute = true): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => {
      this.tabs.update(tab.id, {muted: mute}, (t) => resolve(t));
    });
  }

  /**
   * このサービス経由でLaunchされたタブかどうか返す
   * @param tabId
   */
  knows(tabId: number): Launched {
    return this.launched && this.launched.tab.id === tabId ? this.launched : null;
  }

  openCapturePage(params: { key: any, filename?: string, info?: string }): Promise<chrome.tabs.Tab> {
    const url = this.extension.getURL("/dest/html/capture.html");
    const search = new URLSearchParams(params);
    return new Promise(resolve => {
      this.tabs.create({ url: `${url}?${search.toString()}` }, (tab) => {
        resolve(tab);
      });
    });
  }

  openOptionsPage(): Promise<chrome.tabs.Tab> {
    const url = this.extension.getURL("/dest/html/options.html");
    return new Promise(resolve => {
      this.tabs.query({url}, (tabs) => {
        if (tabs.length === 0) {
          this.tabs.create({url}, (tab) => resolve(tab));
        } else {
          this.tabs.update(tabs[0].id, {active: true}, (tab) => resolve(tab));
        }
      });
    });
  }

  openDashboardPage(frame: { position: { top: number, left: number }, size: { width: number, height: number } }): Promise<chrome.tabs.Tab> {
    const url = this.extension.getURL("/dest/html/dashboard.html");
    return new Promise(resolve => {
      this.tabs.query({url}, (tabs) => {
        if (tabs.length === 0) {
          this.windows.create({
            url,
            type: "popup",
            ...frame.position,
            ...frame.size,
          }, (win) => resolve(win.tabs[0]));
        } else {
          this.windows.update(tabs[0].windowId, { focused: true }, () => resolve(tabs[0]));
        }
      });
    });
  }

  /* tslint:disable max-line-length */
  openDamageSnapshot(data: chrome.windows.CreateData, count: number, key: number, text: string): Promise<chrome.tabs.Tab> {
    const url = this.extension.getURL("/dest/html/dsnapshot.html");
    const search = new URLSearchParams({ count: String(count), key: String(key), text });
    return new Promise(resolve => {
      this.windows.create({
        type: "popup",
        url: `${url}?${search.toString()}`,
        ...data,
        width: Math.floor(data.height * (5 / 8) * count), // 高さにだけ依存して決まります
      }, win => {
        resolve(win.tabs[0]);
      });
    });
  }
  cleanDamageSnapshot(): Promise<chrome.tabs.Tab[]> {
    const url = this.extension.getURL("/dest/html/dsnapshot.html");
    return new Promise(resolve => {
      this.tabs.query({ url: url + "?count=*" }, (tabs) => {
        resolve(tabs.map(tab => {
          this.tabs.remove(tab.id);
          return tab;
        }));
      });
    });
  }

  openDeckCapturePage(): Promise<chrome.tabs.Tab> {
    const url = this.extension.getURL("/dest/html/deckcapture.html");
    return new Promise(resolve => {
      this.tabs.create({url}, tab => resolve(tab));
    });
  }

  /**
   * WindowServiceにあるべきなのかはわからないけれど、とりあえずここにおいておく
   *   1. 開いているゲーム画面が無い場合、つくる
   *   2. ゲーム画面があり、Frameの指定が無い場合はfocusするだけ
   *   3. ゲーム画面があり、Frameの指定がある場合はreconfigureする
   * @param {string} message.id Frameのid（miniとかそういうの)
   */
  async backToGame(message: { id?: string } = {}): Promise<chrome.tabs.Tab> {
    let tab = await this.find();
    if (!tab) {
      const frame = Frame.find<Frame>(message.id) || Frame.latest();
      frame.update({selectedAt: Date.now()});
      tab = await this.create(frame);
      await this.mute(tab, frame.muted);
      return tab;
    }
    const frame = Frame.find<Frame>(message.id);
    if (!frame) {
      return await this.focus(tab);
    }
    tab = await this.reconfigure(tab, frame);
    return Client.for(chrome.tabs, tab.id).message("/reconfigured", {frame});
  }
}

export default WindowService;

/**
 * エアロ領域への対応
 */
export function resizeToAdjustAero(scope: Window) {
  scope.resizeBy(
    scope.outerWidth - scope.innerWidth,
    scope.outerHeight - scope.innerHeight,
  );
}