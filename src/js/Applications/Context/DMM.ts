import {Client, Router} from "chomex";
import Const from "../../Constants";
import Frame from "../Background/Models/Frame";

/**
 * http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/
 * において実行されるアプリケーションの実装です。
 */
export default class DMM {

  private static scrollstyle: string = "kcwidget-scrollability";

  private client;
  private tab: chrome.tabs.Tab;
  private frame: Frame;

  constructor(private scope: Window) {
    this.client = new Client(chrome.runtime, false);
  }

  /**
   * 画面のロード時に1度だけ呼ばれることを想定された初期化ルーチン。
   */
  public async init() {
    const {status, data} = await this.client.message("/window/decoration");
    if (status < 200 && 300 <= status) {
      return;
    }
    if (!data) {
      return;
    }

    const {tab, frame} = data;
    this.tab = tab;
    this.frame = frame;

    this.resizeToAdjustAero();
    this.shiftFrame();
    this.injectStyles();
  }

  /**
   * chrome.tabs.onMessage のリスナー
   */
  public listener(): (message: any) => any {
    const router = new Router();
    router.on("/reconfigured", (message) => this.reconfigure(message));
    return router.listener();
  }

  /**
   * 定期的になんかやるやつ
   */
  public interval(): () => any {
    return () => {
      this.client.message("/window/record", {frame: this.frame});
    };
  }

  /**
   * このタブがまだ生きてる状態で、新しいFrameが指定された場合
   */
  private reconfigure(message: {frame: Frame}) {
    this.frame = message.frame;
    this.resizeToAdjustAero();
  }

  /**
   * エアロ領域の計算と微調整
   * zoom値が必要になるので、this.frameが正しい値になっていることを確認のこと
   */
  private resizeToAdjustAero() {
    this.scope.resizeBy(
      this.scope.outerWidth - Math.floor(this.scope.innerWidth * this.frame.zoom),
      this.scope.outerHeight - Math.floor(this.scope.innerHeight * this.frame.zoom),
    );
  }

  /**
   * ゲーム表示領域を画面ぴったりに移動する
   */
  private shiftFrame() {
    const iframe = this.scope.document.querySelector(Const.GameIFrame) as HTMLIFrameElement;
    const rect = iframe.getBoundingClientRect() as DOMRect;
    iframe.style.position = "relative";
    iframe.style.left = "0";
    iframe.style.top = `-${rect.y + Const.TopSpacing}px`;
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

  private createScrollStyle(scrollable: boolean = false): HTMLStyleElement {
    const style = this.scope.document.createElement("style");
    style.type = "text/css";
    style.id = DMM.scrollstyle;
    style.innerHTML = `/* This CSS is injected by KanColleWidget */
    html {
      overflow-y: ${scrollable ? "scroll" : "hidden"};
    }`;
    return style;
  }
}
