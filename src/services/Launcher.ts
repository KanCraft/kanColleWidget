import { TabService } from "./TabService";
import { WindowService } from "./WindowService";
import { ScriptingService } from "./ScriptingService";

import { Frame } from "../models/Frame";
import { KanColleURL } from "../constants";

export class Launcher {

  constructor(
        private readonly windows: WindowService = new WindowService(),
        private readonly tabs: TabService = new TabService(),
        private readonly scriptings: ScriptingService = new ScriptingService(),
  ) { }

  public static async launch(frame: Frame) {
    return (new this()).launch(frame);
  }

  public static async dashboard() {
    return await (new this()).windows.create({ url: "page/index.html#/dashboard", width: 400, height: 220, type: "popup" });
  }
  public static async options() {
    return await (new this()).tabs.create({ url: "page/index.html#/options" });
  }

  public async launch(frame: Frame) {
    // すでに存在する場合、retouchして終わる
    const exists = await this.find(frame);
    if (exists && exists.id) return this.retouch(exists, /* frame */);
    // ない場合、新規作成してactivateする
    const win = await this.windows.create(frame.toWindowCreateData());
    this.anchor(win, frame);
    await this.activate(win, frame);
  }

  private async anchor(_win: chrome.windows.Window, frame: Frame) {
    this.scriptings.func(_win.tabs![0].id!, (f) => {
      sessionStorage.setItem("kancollewidget-frame-jsonstr", JSON.stringify(f));
    }, [frame]);
  }

  public async retouch(win: chrome.windows.Window, /* frame: Frame */) {
    await this.focus(win.id!);
  }

  public async activate(win: chrome.windows.Window, frame: Frame) {
    const tab = win.tabs![0];
    this.scriptings.js(tab.id!, ["dmm.js"]);
    this.scriptings.css(tab.id!, ["assets/dmm.css"]);
    if (frame.theater.enabled) setTimeout(() => {
      this.scriptings.css({ tabId: tab.id!, allFrames: true }, ["assets/theater.css"]);
    }, 5 * 1000);
  }

  public async find(frame?: Frame): Promise<chrome.windows.Window | undefined> {
    const url = frame ? frame.url : KanColleURL;
    const tabs = await this.tabs.query({ url });
    for (const tab of tabs) {
      if (tab.url !== url) continue;
      const win = await this.windows.get(tab.windowId, { populate: true });
      if (win.tabs && win.tabs.length === 1) return win;
    }
    return;
  }

  public async focus(windowId: number) {
    return this.windows.update(windowId, { focused: true });
  }
}