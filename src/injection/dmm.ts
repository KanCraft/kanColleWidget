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
    public static create(): InAppActionButtons {
      if (this.self && this.self.container) return this.self;
      this.self = new InAppActionButtons();
      return this.self;
    }
    constructor() {
      this.container = this.createContainer();
      this.muteButton = this.createButton("🔊", () => this.toggleMute());
      this.screenshotButton = this.createButton("📷", () => this.screenshot());
      this.container.appendChild(this.screenshotButton);
      this.container.appendChild(this.muteButton);
      window.document.body.appendChild(this.container);
    }

    private async screenshot() {
      this.container.style.display = "none";
      await chrome.runtime.sendMessage<{ action: string }, chrome.tabs.Tab>(chrome.runtime.id, { action: "/screenshot" });
      await new Promise(resolve => setTimeout(resolve, 100)); // XXX: なぜか写り込んじゃうので、ちょっと待つ
      this.container.style.display = "block";
    }

    private async toggleMute() {
      const tab = await chrome.runtime.sendMessage<{ action: string }, chrome.tabs.Tab>(chrome.runtime.id, { action: "/mute:toggle" })
      this.muteButton.innerHTML = tab.mutedInfo?.muted ? "🔇" : "🔊";
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
    private createButton(text: string, onclick = () => { }): HTMLButtonElement {
      const button = window.document.createElement("button");
      button.style.backgroundColor = "#fff";
      button.style.fontSize = "32px";
      button.style.cursor = "pointer";
      button.style.border = "none";
      button.innerHTML = text;
      button.addEventListener("click", onclick);
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

  (async function __main__() {
    resize();
    setInterval(track, 10 * 1000);
    startListeningMessage();
    InAppActionButtons.create();
  })();

})();
