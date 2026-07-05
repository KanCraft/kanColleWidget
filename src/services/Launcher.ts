import { TabService } from "./TabService";
import { WindowService } from "./WindowService";
import { ScriptingService } from "./ScriptingService";

import { Frame } from "../models/Frame";
import { KanColleURL } from "../constants";
import { DashboardConfig } from "../models/configs/DashboardConfig";
import { DamageSnapshotConfig } from "../models/configs/DamageSnapshotConfig";
import { sleep } from "../utils";

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
    const self = new this();
    const url = chrome.runtime.getURL("page/index.html#/dashboard");
    const tabs = await self.tabs.query({ windowType: "popup" });
    const exists = tabs.find(t => t.url === url);
    if (exists) {
      return self.windows.update(exists.windowId!, { focused: true });
    }
    const dashboardConfig = config ?? await DashboardConfig.user();
    return await self.windows.create({ url: "page/index.html#/dashboard", type: "popup", ...dashboardConfig.toWindowCreateData() });
  }

  /**
   * オプションページを新規タブで開く。
   * @returns 作成されたタブの Promise
   */
  public static async options() {
    return await (new this()).tabs.create({ url: "page/index.html#/options" });
  }

  /**
   * ログブックページを新規タブで開く。
   * @returns 作成されたタブの Promise
   */
  public static async logbook() {
    return await (new this()).tabs.create({ url: "page/index.html#/logbook" });
  }

  /**
   * 編成キャプチャページを新規タブで開く。
   * @returns 作成されたタブの Promise
   */
  public static async fleetcapture() {
    return await (new this()).tabs.create({ url: "page/index.html#/fleet-capture" });
  }

  /**
   * スクショ編集ページを新規タブで開く。
   * @param key TempStorage に保存した撮影画像の取り出しキー
   * @returns 作成されたタブの Promise
   */
  public static async screenshotEdit(key: string) {
    const search = new URLSearchParams({ key });
    return await (new this()).tabs.create({ url: `page/index.html#/screenshot-edit?${search.toString()}` });
  }

  /**
   * ダメージスナップショットページを新規ウィンドウ（popup）で開く。
   * @returns {Promise<chrome.windows.Window>} 作成されたウィンドウのPromise
   */
  public static async damagesnapshot(config: DamageSnapshotConfig) {
    const self = new this();
    const exists = await self.getDsnapshotTab();
    if (exists) {
      await self.windows.update(exists.windowId!, { focused: true });
      return await self.windows.get(exists.windowId!, { populate: true });
    }
    let win = await (new this()).windows.create({
      type: "popup",
      url: chrome.runtime.getURL("page/index.html#/damage-snapshot"),
      ...config.position,
      ...config.size,
    });
    if (!win) throw new Error("Failed to create dashboard window");
    while (win.tabs![0].status !== "complete") {
      await sleep(10);
      win = await chrome.windows.get(win.id!, { populate: true });
    }
    return win;
  }

  public async getDsnapshotTab(): Promise<chrome.tabs.Tab | undefined> {
    const url = chrome.runtime.getURL("page/index.html#/damage-snapshot");
    return (await this.tabs.query({ windowType: "popup" })).find(t => t.url === url);
  }

  /**
   * ゲーム窓を開く。既存があれば retouch（サイズ調整＋focus）し、無ければ新規作成して activate する。
   * @param frame 起動対象のフレーム設定
   * @returns ゲーム窓を新規作成したとき true、既存窓を再フォーカスしたとき false（#1216）
   */
  public async launch(frame: Frame): Promise<boolean> {
    return this.findOrOpen(frame, (win) => this.retouch(win, frame));
  }

  /**
   * 既存のゲーム窓があれば focus のみ、無ければ新規作成する。
   * retouch と違いサイズ調整を行わないため、通知クリックなど
   * 「単にアクティブ化したいだけ」の用途に使う（#1810）。
   * @param frame 窓が無いとき新規作成に使うフレーム設定
   * @returns ゲーム窓を新規作成したとき true、既存窓を再フォーカスしたとき false
   */
  public async focusOrLaunch(frame: Frame): Promise<boolean> {
    return this.findOrOpen(frame, (win) => this.focus(win.id!));
  }

  /**
   * 既存のゲーム別窓を探し、あれば onExists で再利用、無ければ新規作成する。
   * 「既存窓に対する振る舞い」だけが launch と focusOrLaunch の差なので、
   * find→存在判定→open の共通骨格をここに集約する。
   * @param frame 検索・新規作成に使うフレーム設定
   * @param onExists 既存窓が見つかったときの再利用処理
   * @returns ゲーム窓を新規作成したとき true、既存窓を再利用したとき false
   */
  private async findOrOpen(frame: Frame, onExists: (win: chrome.windows.Window) => Promise<unknown>): Promise<boolean> {
    const exists = await this.find(frame);
    if (exists && exists.id) {
      await onExists(exists);
      return false;
    }
    await this.open(frame);
    return true;
  }

  /**
   * フレーム設定からゲーム別窓を新規作成し、注入・ミュート・活性化まで行う。
   * @param frame 起動対象のフレーム設定
   */
  private async open(frame: Frame): Promise<void> {
    const win = await this.windows.create(frame.toWindowCreateData());
    if (!win) throw new Error("Failed to create game window");
    const innerIframe = await this.waitForInnerIframeLoaded(win.tabs![0].id!);
    this.anchor(win, frame);
    this.mute(win.tabs![0].id!, frame.muted);
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
   * 既存のゲーム別窓を前面に出し、サイズをフレーム設定に合わせて調整する。
   * @param win 対象ウィンドウ
   */
  public async retouch(win: chrome.windows.Window, frame: Frame | null) {
    if (frame) {
      await this.windows.update(win.id!, { ...frame.size });
      chrome.tabs.sendMessage(win.tabs![0].id!, { __action__: "/injected/dmm/retouch" });
    }
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
   * リロードなどで失われたコンテンツスクリプトを再注入し、別窓を再活性化する。
   * MV3 では scripting.executeScript で注入したスクリプトはリロードで失われるため、
   * 内側 iframe のロードを待ってから activate() 相当の注入一式を再実行する。
   * @param win 再活性化対象のゲーム別窓（tabs が populate 済みであること）
   */
  public async reactivate(win: chrome.windows.Window) {
    const tabId = win.tabs?.[0]?.id;
    if (typeof tabId !== "number") return;
    const innerIframe = await this.waitForInnerIframeLoaded(tabId);
    await this.activate(win, innerIframe);
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
  public async capture(tabId: number, options: chrome.extensionTypes.ImageDetails = {
    format: "jpeg",
    quality: 100,
  }): Promise<string> {
    return this.tabs.capture(tabId, options);
  }
}
