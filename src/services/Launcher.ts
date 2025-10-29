import { TabService } from "./TabService";
import { WindowService } from "./WindowService";
import { ScriptingService } from "./ScriptingService";

import { Frame } from "../models/Frame";
import { KanColleURL } from "../constants";
import { DashboardConfig } from "../models/configs/DashboardConfig";

/**
 * 艦これウィジェットがゲーム別窓や関連タブを起動・管理するための制御クラス。
 * WindowService/TabService/ScriptingService を束ねて、ユーザー操作なしに必要な注入を実行する。
 */
export class Launcher {

  /**
   * 依存サービスを差し替え可能に初期化する。
   * @param windows Chrome ウィンドウ操作を担うサービス
   * @param tabs Chrome タブ操作を担うサービス
   * @param scriptings コンテンツスクリプトや CSS の注入を担うサービス
   */
  constructor(
        private readonly windows: WindowService = new WindowService(),
        private readonly tabs: TabService = new TabService(),
        private readonly scriptings: ScriptingService = new ScriptingService(),
  ) { }

  /**
   * 新しいインスタンスでゲーム別窓を起動するユーティリティ。
   * @param frame 起動対象のフレーム設定
   * @returns 起動処理の Promise
   */
  public static async launch(frame: Frame) {
    return (new this()).launch(frame);
  }

  /**
   * ダッシュボードをポップアップウィンドウで開く。
   * @param config ダッシュボード窓の設定（未指定時はユーザー設定を取得）
   * @returns 作成されたウィンドウの Promise
   */
  public static async dashboard(config?: DashboardConfig) {
    const dashboardConfig = config ?? await DashboardConfig.user();
    return await (new this()).windows.create({ url: "page/index.html#/dashboard", type: "popup", ...dashboardConfig.toWindowCreateData() });
  }

  /**
   * オプションページを新規タブで開く。
   * @returns 作成されたタブの Promise
   */
  public static async options() {
    return await (new this()).tabs.create({ url: "page/index.html#/options" });
  }

  /**
   * 編成キャプチャページを新規タブで開く。
   * @returns 作成されたタブの Promise
   */
  public static async fleetcapture() {
    return await (new this()).tabs.create({ url: "page/index.html#/fleet-capture" });
  }

  /**
   * 指定されたフレーム設定でゲーム別窓を起動する。
   * 既存別窓があればフォーカスのみ行い、無ければ新規作成して活性化する。
   * @param frame 起動対象のフレーム設定
   */
  public async launch(frame: Frame) {
    // すでに存在する場合、retouchして終わる
    const exists = await this.find(frame);
    if (exists && exists.id) return this.retouch(exists, /* frame */);
    // ない場合、新規作成してactivateする
    const win = await this.windows.create(frame.toWindowCreateData());
    const innerIframe = await this.waitForInnerIframeLoaded(win.tabs![0].id!);
    this.anchor(win, frame);
    await this.activate(win, innerIframe);
  }

  /**
   * osapi.dmm.com/gadgets/ifr?... 形式の iframe が完全に読み込まれるまで待機する。
   * @param tabId 
   * @param timeout 
   * @returns 
   */
  private async waitForInnerIframeLoaded(tabId: number, timeout: number = 8 * 1000) {
    return new Promise<chrome.webNavigation.GetAllFrameResultDetails>((resolve, reject) => {
      const check = async (timeoutMilliseconds: number) => {
        const all_webframes = (await chrome.webNavigation.getAllFrames({ tabId }) || []);
        const found = all_webframes.find(f => f.url.includes("osapi.dmm.com/gadgets/ifr"));
        if (found) resolve(found);
        if (timeoutMilliseconds <= 0) reject(new Error("Timeout waiting for inner iframe loaded"));
        setTimeout(() => check(timeoutMilliseconds - 500), 500);
      };
      check(timeout);
    });
  }

  /**
   * 生成した別窓の最初のタブにフレーム情報を保存する。
   * @param _win 作成済みウィンドウ
   * @param frame 保存対象となるフレーム設定
   */
  private async anchor(_win: chrome.windows.Window, frame: Frame) {
    this.scriptings.func(_win.tabs![0].id!, (f) => {
      sessionStorage.setItem("kancollewidget-frame-jsonstr", JSON.stringify(f));
    }, [frame]);
  }

  /**
   * 既存のゲーム別窓を前面に出す。
   * @param win 対象ウィンドウ
   */
  public async retouch(win: chrome.windows.Window, /* frame: Frame */) {
    await this.focus(win.id!);
  }

  /**
   * 起動直後の別窓タブにスクリプトやスタイルを注入し、必要なら劇場モード用 CSS も適用する。
   * @param win 対象ウィンドウ
   * @param frame 劇場モードなどの設定を含むフレーム情報
   */
  public async activate(win: chrome.windows.Window, innerIframe: chrome.webNavigation.GetAllFrameResultDetails) {
    const tab = win.tabs![0];
    this.scriptings.js(tab.id!, ["dmm.js"]);
    this.scriptings.css(tab.id!, ["assets/dmm.css"]);
    this.scriptings.css({ tabId: tab.id!, frameIds: [innerIframe.frameId] }, ["assets/osapi.css"]);
    // if (frame.theater.enabled) setTimeout(() => {
    //   this.scriptings.css({ tabId: tab.id!, allFrames: true }, ["assets/theater.css"]);
    // }, 5 * 1000);
  }

  /**
   * 既存タブから対象 URL のゲーム別窓を検索する。
   * @param frame 検索対象のフレーム（未指定時は既定 URL）
   * @returns 見つかったウィンドウ、存在しない場合は undefined
   */
  public async find(frame?: Frame): Promise<chrome.windows.Window | undefined> {
    const url = frame ? frame.url : KanColleURL;
    const pattern = url.endsWith("*") ? url : `${url}*`;
    const tabs = await this.tabs.query({ url: [pattern], windowType: "popup" });
    for (const tab of tabs) {
      if (!(tab.url && tab.url.startsWith(url))) continue;
      const win = await this.windows.get(tab.windowId, { populate: true, windowTypes: ["popup"] });
      if (win.tabs && win.tabs.length === 1) return win;
    }
    return;
  }

  /**
   * 指定ウィンドウをフォーカスする。
   * @param windowId フォーカス対象のウィンドウ ID
   * @returns ウィンドウ更新の Promise
   */
  public async focus(windowId: number) {
    return this.windows.update(windowId, { focused: true });
  }

  /**
   * 指定タブのミュート状態を更新する。
   * @param tabId 対象タブ ID
   * @param muted ミュートするかどうか（既定は true）
   * @returns タブ更新の Promise
   */
  public async mute(tabId: number, muted: boolean = true) {
    return this.tabs.update(tabId, { muted });
  }

  /**
   * 指定タブの可視領域をキャプチャし、Base64 データ URL を返す。
   * @param tabId 対象タブ ID
   * @param options Chrome のキャプチャオプション（既定は JPEG/100）
   * @returns キャプチャ結果の文字列
   */
  public async capture(tabId: number, options: chrome.tabs.CaptureVisibleTabOptions = {
    format: "jpeg",
    quality: 100,
  }): Promise<string> {
    return this.tabs.capture(tabId, options);
  }
}
