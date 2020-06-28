import {Client, Router} from "chomex";
import Const from "../../Constants";
import Frame from "../Models/Frame";
import InAppButtons from "./Features/InAppButtons";
import { sleep } from "../../utils";

/**
 * http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/
 * において実行されるアプリケーションの実装です。
 */
export default class DMM {

  private static scrollstyle = "kcwidget-scrollability";

  private client;
  private tab: chrome.tabs.Tab;
  private frame: Frame;
  private initialized = false;
  private resizeTimerId: number;

  constructor(private scope: Window) {
    this.client = new Client(chrome.runtime, false);
  }

  /**
   * 画面のロード時に1度だけ呼ばれることを想定された初期化ルーチン。
   */
  async init() {
    const { status, data } = await this.client.message("/window/decoration");
    if (status < 200 && 300 <= status) {
      return;
    }
    if (!data) {
      return;
    }

    const { tab, frame, configs } = data;
    this.tab = tab;
    this.frame = frame;

    this.resizeToAdjustAero();
    this.shiftFrame(this.frame.zoom);
    this.injectStyles();
    this.hideNavigations(Const.HiddenElements);

    // DEBUG: ホントはConfigを見てやる。/window/decorationのレスポンスに必要なConfigも含めちゃえばいいのでは？
    this.showInAppButtons(configs, frame);

    setTimeout(() => this.initialized = true, 200);

    // Kcs2のコンテキストcontent_scriptをbackgroundからexecuteしてもらう
    await sleep(5 * 1000); // iframeのさらに下のiframeのonloadを待つ必要がある...
    this.client.message("/window/request-content-script");
  }

  /**
   * このタブがまだ生きてる状態で、新しいFrameが指定された場合
   */
  private reconfigure(message: {frame: Frame}) {
    this.frame = message.frame;
    this.resizeToAdjustAero();
  }

  /**
   * アプリ内ボタンの表示
   */
  private showInAppButtons(configs: {[key: string]: any}, frame: Frame) {

    const buttons = new InAppButtons(this.scope.document, configs, frame, this.client);
    if (!buttons.enabled()) {
      return;
    }
    this.scope.document.body.appendChild(buttons.element());
  }

  /**
   * 設定しだいでは、DMMの要素を消す
   * TODO: 設定できるようにする
   */
  private hideNavigations(targets: string[] = []) {
    targets.map(selector => {
      const e = document.querySelector(selector) as HTMLElement;
      if (e && e.style) {
        e.style.visibility = "hidden";
      }
    });
  }

  /**
   * エアロ領域の計算と微調整
   * zoom値が必要になるので、this.frameが正しい値になっていることを確認のこと
   */
  private resizeToAdjustAero() {
    this.scope.resizeBy(
      this.scope.outerWidth - this.scope.innerWidth,
      this.scope.outerHeight - this.scope.innerHeight,
    );
  }

  /**
   * ゲーム表示領域を画面ぴったりに移動する
   */
  private async shiftFrame(zoom: number) {

    // FIXME: iframe内のロードが終わる前に動かすと真っ白になる？
    // const sleep = (sec: number) => new Promise(resolve => setTimeout(() => resolve(), sec * 1000));
    // await sleep(4);

    const iframe = this.scope.document.querySelector(Const.GameIFrame) as HTMLIFrameElement;
    iframe.style.position = "absolute";
    iframe.style.zIndex = "2";
    iframe.style.transform = `scale(${zoom})`;

    // コンテンツを中央に寄せる
    const wrapper = this.scope.document.querySelector(Const.GameWrapper) as HTMLDivElement;
    wrapper.style.position = "fixed";
    wrapper.style.width = "100vw";
    wrapper.style.height = "100vh";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.zIndex = "1";
    // 動的なものはこれだけなので、これ以外はinjectに持っていってもいいかもしれない
    wrapper.style.paddingTop = `${54 * zoom}px`;
  }

  private injectStyles() {
    this.scope.document.head.appendChild(this.createPersistenStyle());
    this.scope.document.head.appendChild(this.createScrollStyle(false));
  }

  private createPersistenStyle(): HTMLStyleElement {
    const style = this.scope.document.createElement("style");
    style.type = "text/css";
    style.id = "kcwidget-persistent";
    style.innerHTML = `/* This CSS is injected by KanColleWidget */
    html {
      overflow-x: hidden;
    }
    ::-webkit-scrollbar {
      display: none;
    }
    `;
    return style;
  }

  private createScrollStyle(scrollable = false): HTMLStyleElement {
    const style = this.scope.document.createElement("style");
    style.type = "text/css";
    style.id = DMM.scrollstyle;
    style.innerHTML = `/* This CSS is injected by KanColleWidget */
    html {
      overflow-y: ${scrollable ? "scroll" : "hidden"};
    }`;
    return style;
  }

  /**
   * 画面を閉じる前に呼ばれる
   */
  onbeforeunload(ev: Event) {
    return ev.returnValue;
  }

  /**
   * 画面がリサイズしたときのルーチン
   * onresizeイベントはすごい勢いでたくさん発火するので、
   * ある程度debounceしている。
   */
  onresize() {

    if (!this.initialized) {
      return false;
    }

    const debounce = 1000;
    if (this.resizeTimerId > 0) {
      clearTimeout(this.resizeTimerId);
    }

    this.resizeTimerId = setTimeout(() => {
      // 現在のウィンドウの形が、オリジナルより横にながければ負の値、縦にながければ正の値を取る。
      const a = (this.scope.innerHeight / this.scope.innerWidth) - (Const.GameHeight / Const.GameWidth);
      // 短辺を基準にズーム値を決定する
      const zoom = a < 0 ? this.scope.innerHeight / Const.GameHeight : this.scope.innerWidth / Const.GameWidth;
      this.shiftFrame(zoom).then();
    }, debounce);
  }

  /**
   * chrome.tabs.onMessage のリスナー
   */
  listener(): (message: any) => any {
    const router = new Router();
    router.on("/reconfigured", (message) => this.reconfigure(message));
    return router.listener();
  }

  /**
   * 定期的になんかやるやつ
   */
  interval(): () => any {
    return () => {
      this.client.message("/window/record", {frame: this.frame});
    };
  }
}
