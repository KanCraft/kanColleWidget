import { type GameWindowConfig } from '../models/configs/GameWindowConfig';
import { ocr, warmUpOcrWorker } from './ocrWorker';
import type { Route, OcrResultRoute, OcrPurpose, DmmOcrPayload } from '../messages';
// import { Rectangle, load, crop } from './crop';

(async () => {
  // const GameIFrame = "iframe#game_frame";

  // 拡張内メッセージのルート文字列。src/messages.ts の Routes と値を一致させる（型注釈で乖離を tsc が検出）。
  // content script は classic script として注入されるため src/messages.ts を実行時 import できない。
  const SCREENSHOT: Route<"SCREENSHOT"> = "/screenshot";
  const MUTE_TOGGLE: Route<"MUTE_TOGGLE"> = "/mute:toggle";
  const FRAME_MEMORY_TRACK: Route<"FRAME_MEMORY_TRACK"> = "/frame/memory:track";
  const FRAME_SELF_CHECK_MISMATCH: Route<"FRAME_SELF_CHECK_MISMATCH"> = "/frame/self-check:mismatch";
  const CONFIGS: Route<"CONFIGS"> = "/configs";
  const DMM_OCR: Route<"DMM_OCR"> = "/injected/dmm/ocr";
  const DMM_RETOUCH: Route<"DMM_RETOUCH"> = "/injected/dmm/retouch";


  /**
   * 画面内のボタンの描画
   */
  class InAppActionButtons {
    private container: HTMLDivElement;
    private muteButton: HTMLButtonElement;
    private screenshotButton: HTMLButtonElement;
    private static self: InAppActionButtons | null = null;

    // Heroicons SVG (outline, 24x24)
    private static readonly ICON_SPEAKER_WAVE = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"/></svg>';
    private static readonly ICON_SPEAKER_X_MARK = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"/></svg>';
    private static readonly ICON_CAMERA = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"/></svg>';
    // DOM から外したあとに最低限待つフレーム数。Chrome の描画タイミング次第で 1 フレームでは不足するため 2 を既定とする。
    private static readonly FRAME_WAIT_FOR_CAPTURE = 2;

    public static create(config: GameWindowConfig): InAppActionButtons {
      if (this.self && this.self.container) return this.self;
      this.self = new InAppActionButtons(config);
      return this.self;
    }
    constructor(config: GameWindowConfig) {
      // ボタンサイズはゲーム画面に対する倍率（vw）で定義する。
      // 大(buttonSize>=100)=6vw / 小=4vw（#1177 の「大小=6%:4%」準拠）。
      // ピクセル固定だと窓を小さくした際にボタンが相対的に肥大化し、基地航空隊の操作 UI に被るため。
      const sizeVw = config.buttonSize >= 100 ? 6 : 4;
      this.container = this.createContainer();
      this.muteButton = this.createButton(InAppActionButtons.ICON_SPEAKER_WAVE, () => this.toggleMute(), sizeVw);
      this.screenshotButton = this.createButton(InAppActionButtons.ICON_CAMERA, () => this.screenshot(), sizeVw);
      if (config.showScreenshotButton) {
        this.container.appendChild(this.screenshotButton);
      }
      if (config.showMuteButton) {
        this.container.appendChild(this.muteButton);
      }
      window.document.body.appendChild(this.container);
    }

    private async screenshot() {
      const parent = this.container.parentElement;
      if (!parent) return;
      // Chrome のキャプチャ API は現在表示中のフレームを即座に保存するため、
      // 非表示を指示しただけでは描画が反映される前のフレームが撮影対象になる。
      // ボタン自身が撮影フレームに残る原因がここにあるので、いったん DOM から外し、
      // 次フレームの描画完了を待ってから撮影する。
      parent.removeChild(this.container);
      await this.waitNextFrame(InAppActionButtons.FRAME_WAIT_FOR_CAPTURE);
      try {
        await chrome.runtime.sendMessage<{ __action__: Route<"SCREENSHOT"> }, chrome.tabs.Tab>(chrome.runtime.id, { __action__: SCREENSHOT });
      } finally {
        parent.appendChild(this.container);
      }
    }

    private async waitNextFrame(times: number = 1) {
      for (let i = 0; i < times; i += 1) {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }
    }

    private async toggleMute() {
      const tab = await chrome.runtime.sendMessage<{ __action__: Route<"MUTE_TOGGLE"> }, chrome.tabs.Tab>(chrome.runtime.id, { __action__: MUTE_TOGGLE })
      this.muteButton.innerHTML = tab.mutedInfo?.muted ? InAppActionButtons.ICON_SPEAKER_X_MARK : InAppActionButtons.ICON_SPEAKER_WAVE;
    }
    private createContainer(): HTMLDivElement {
      const div = window.document.createElement("div");
      div.style.position = "fixed";
      div.style.top = "0";
      div.style.right = "0";
      div.style.opacity = "0";
      div.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      div.addEventListener("mouseover", () => div.style.opacity = "0.8");
      div.addEventListener("mouseout", () => div.style.opacity = "0");
      div.id = "kcw-inapp-action-buttons";
      return div;
    }
    private createButton(svgContent: string, onclick = () => { }, sizeVw: number): HTMLButtonElement {
      const button = window.document.createElement("button");
      button.style.backgroundColor = "#fff";
      // padding は従来の 8/48=1/6 比を維持する。
      button.style.width = `${sizeVw}vw`;
      button.style.height = `${sizeVw}vw`;
      button.style.padding = `${sizeVw / 6}vw`;
      button.style.cursor = "pointer";
      button.style.border = "none";
      button.style.display = "flex";
      button.style.alignItems = "center";
      button.style.justifyContent = "center";
      button.innerHTML = svgContent;
      button.addEventListener("click", onclick);
      // SVGのサイズを調整
      const svg = button.querySelector("svg");
      if (svg) {
        svg.style.width = "100%";
        svg.style.height = "100%";
      }
      return button;
    }
  }

  /**
   * BazelというかAeroというか、を考慮して、ウィンドウのリサイズを行う。
   * 外形(outer)と内寸(inner)の差分＝ウィンドウ装飾ぶんを足す非冪等な補正で、
   * 再実行のたびに窓が装飾ぶん拡大してしまう（#1810, #1813）。呼び出してよいのは
   * __main__（sessionStorage ガード付き）と retouch ハンドラ（Launcher.retouch が
   * 外形を戻した直後）の2箇所だけ。詳細は ADR 0002。
   */
  function resize() {
    window.resizeBy(window.outerWidth - window.innerWidth, window.outerHeight - window.innerHeight);
  }

  /**
   * __memory__ の Frame を更新する
   * 今開いている位置とサイズを記憶する
   */
  function track() {
    chrome.runtime.sendMessage(chrome.runtime.id, {
      __action__: FRAME_MEMORY_TRACK,
      position: { left: window.screenX, top: window.screenY },
      size: { width: window.innerWidth, height: window.innerHeight },
    });
    selfCheck();
  }

  /**
   * #game_frame が実際にウィンドウ全体（100vw/100vh）を占めているかを軽く確認する。
   * activate() の注入失敗などで assets/dmm.css が当たっていないと #game_frame がネイティブ
   * サイズのまま残り、白い余白付きの縮小表示になる（#1848）。ズレを検知したら、次の
   * ナビゲーションイベントを待たずに再注入を要求する。
   */
  function selfCheck() {
    const frame = document.querySelector<HTMLIFrameElement>("#game_frame");
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const fits = Math.abs(rect.width - window.innerWidth) < 2 && Math.abs(rect.height - window.innerHeight) < 2;
    if (!fits) {
      chrome.runtime.sendMessage(chrome.runtime.id, { __action__: FRAME_SELF_CHECK_MISMATCH });
    }
  }

  function fetchNecessaryConfig(): Promise<{
    game: GameWindowConfig;
  }> {
    return new Promise(resolve => {
      chrome.runtime.sendMessage(chrome.runtime.id, { __action__: CONFIGS }, resolve);
    });
  }

  function startListeningMessage() {
    chrome.runtime.onMessage.addListener(async (msg) => {
      if (msg.__action__ === DMM_OCR && msg.url) {
        const request = msg as DmmOcrPayload<OcrPurpose>;
        const url = request.url;
        const i = document.createElement("img"); i.src = url; document.body.appendChild(i);
        const ret = await ocr(url);
        const route: OcrResultRoute = `/injected/dmm/ocr/${request.purpose}:result`;
        chrome.runtime.sendMessage(chrome.runtime.id, {
          __action__: route, data: ret.data,
          purpose: request.purpose, [request.purpose]: request[request.purpose],
        });
      }
      if (msg.__action__ === DMM_RETOUCH) {
        // retouch は Launcher 側で windows.update により外形をフレーム設定へ
        // 戻した直後に届くため、ここでは無条件に補正してよい
        resize();
      }
    });
  }

  /**
   * ウィンドウを閉じようとしたときに確認ダイアログを表示
   */
  function setupBeforeUnloadHandler() {
    window.addEventListener("beforeunload", (event) => {
      // 標準的な確認メッセージを表示
      event.preventDefault();
      // Chrome では returnValue に値を設定することで確認ダイアログが表示される
      event.returnValue = "";
    });
  }

  (async function __main__() {
    // resize は1タブにつき1回だけ。sessionStorage はリロードを跨いで残るため、
    // リロード再注入時はスキップされ、窓サイズの累積（#1813）も手動リサイズの
    // 巻き戻しも起きない。
    if (!sessionStorage.getItem("kcw_resized")) {
      resize();
      sessionStorage.setItem("kcw_resized", "1");
    }
    setInterval(track, 10 * 1000);
    warmUpOcrWorker();
    const configs = await fetchNecessaryConfig();
    startListeningMessage();
    InAppActionButtons.create(configs.game);
    const shouldAlertBeforeClose = configs.game.alertBeforeClose ?? true;
    if (shouldAlertBeforeClose) setupBeforeUnloadHandler();
  })();

})();
