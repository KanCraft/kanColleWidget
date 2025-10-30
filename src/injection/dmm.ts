import { createWorker, OEM, type RecognizeResult, type WorkerParams } from 'tesseract.js';
// import { Rectangle, load, crop } from './crop';

(async () => {
  // const GameIFrame = "iframe#game_frame";


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

    public static create(): InAppActionButtons {
      if (this.self && this.self.container) return this.self;
      this.self = new InAppActionButtons();
      return this.self;
    }
    constructor() {
      this.container = this.createContainer();
      this.muteButton = this.createButton(InAppActionButtons.ICON_SPEAKER_WAVE, () => this.toggleMute());
      this.screenshotButton = this.createButton(InAppActionButtons.ICON_CAMERA, () => this.screenshot());
      this.container.appendChild(this.screenshotButton);
      this.container.appendChild(this.muteButton);
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
        await chrome.runtime.sendMessage<{ action: string }, chrome.tabs.Tab>(chrome.runtime.id, { action: "/screenshot" });
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
      const tab = await chrome.runtime.sendMessage<{ action: string }, chrome.tabs.Tab>(chrome.runtime.id, { action: "/mute:toggle" })
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
    private createButton(svgContent: string, onclick = () => { }): HTMLButtonElement {
      const button = window.document.createElement("button");
      button.style.backgroundColor = "#fff";
      button.style.width = "48px";
      button.style.height = "48px";
      button.style.padding = "8px";
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
   * BazelというかAeroというか、を考慮して、ウィンドウのリサイズを行う
   */
  function resize() {
    // TODO: これだとなんか問題ありそう
    window.resizeBy(window.outerWidth - window.innerWidth, window.outerHeight - window.innerHeight);
  }

  /**
   * __memory__ の Frame を更新する
   * 今開いている位置とサイズを記憶する
   */
  function track() {
    chrome.runtime.sendMessage(chrome.runtime.id, {
      __action__: "/frame/memory:track",
      position: { left: window.screenX, top: window.screenY },
      size: { width: window.innerWidth, height: window.innerHeight },
    });
  }

  function startListeningMessage() {
    chrome.runtime.onMessage.addListener(async (msg) => {
      if (msg.__action__ === "/injected/dmm/ocr" && msg.url) {
        const url = msg.url;
        const i = document.createElement("img"); i.src = url; document.body.appendChild(i);
        const ret = await ocr(url);
        chrome.runtime.sendMessage(chrome.runtime.id, {
          __action__: `/injected/dmm/ocr/${msg.purpose}:result`, data: ret.data,
          purpose: msg.purpose, [msg.purpose]: msg[msg.purpose],
        });
      }
      if (msg.__action__ === "/injected/dmm/retouch") {
        resize();
      }
    });
  }

  async function ocr(url: string, params: Partial<WorkerParams> = { tessedit_char_whitelist: "0123456789:" }): Promise<RecognizeResult> {
    const worker = await createWorker('eng', OEM.LSTM_ONLY, {
      logger: m => console.log(m),
      workerPath: chrome.runtime.getURL('tessworker.min.js'),
      langPath: chrome.runtime.getURL('tessdata-4.0.0_best_int'),
    });
    worker.setParameters(params);
    const ret = await worker.recognize(url);
    worker.terminate();
    return ret;
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
    resize();
    setInterval(track, 10 * 1000);
    startListeningMessage();
    InAppActionButtons.create();
    setupBeforeUnloadHandler();
  })();

})();
