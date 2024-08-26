import { createWorker, RecognizeResult, WorkerParams } from 'tesseract.js';
import { type FrameParams } from "../models/Frame";

(async () => {
  const GameRawWidth = 1200;
  const GameRawHeight = 720;
  const GameWrapper = "div#area-game";
  const GameIFrame = "iframe#game_frame";
  let resizetimeout: number;

  // sessionStorageに入ってくれているFrameParamsを取得
  const frame: FrameParams = JSON.parse(sessionStorage.getItem("kancollewidget-frame-jsonstr") || "{}");

  (function __main__() {
    resize();
    fit(frame.zoom);
    window.onresize = onresize;
    setInterval(track, 10 * 1000);
    startListeningMessage();
  })();

  /**
     * BazelというかAeroというか、を考慮して、ウィンドウのリサイズを行う
     */
  function resize() {
    // TODO: これだとなんか問題ありそう
    window.resizeBy(window.outerWidth - window.innerWidth, window.outerHeight - window.innerHeight);
  }

  /**
     * ズーム値に合わせてiframeをフィットさせゲーム領域をぴったり中央に表示する
     * @param zoom ズーム値
     */
  function fit(zoom: number) {
    const iframe = window.document.querySelector(GameIFrame) as HTMLIFrameElement;
    iframe.style.position = "absolute";
    iframe.style.transition = "transform 0.2s";
    iframe.style.zIndex = "2";
    iframe.style.transform = `scale(${zoom})`;
    // コンテンツを中央に寄せる
    const wrapper = window.document.querySelector(GameWrapper) as HTMLDivElement;
    wrapper.style.position = "fixed";
    wrapper.style.width = "100vw";
    wrapper.style.height = "100vh";
    wrapper.style.top = "0";
    wrapper.style.left = "0";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.zIndex = "1";
    wrapper.style.paddingTop = `${54 * zoom}px`; // 54pxは微妙なiframeの中の余白
  }

  function onresize() {
    clearTimeout(resizetimeout); // さっきセットしたタイムアウトはキャンセル
    const execute = () => {
      const a = (window.innerHeight / window.innerWidth) - (GameRawHeight / GameRawWidth);
      // 短辺を基準にズーム値を決定する
      const zoom = a < 0 ? window.innerHeight / GameRawHeight : window.innerWidth / GameRawWidth;
      fit(zoom);
    }
    const debounce = 200;
    resizetimeout = setTimeout(execute, debounce) as unknown as number;
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
        const img = await load(msg.url);
        const rect = Rectangle.new(img).game().purpose(msg.purpose, msg[msg.purpose]);
        const url = await crop(img, rect);
        const i = document.createElement("img"); i.src = url; document.body.appendChild(i);
        const ret = await ocr(url);
        chrome.runtime.sendMessage(chrome.runtime.id, {
          __action__: `/injected/dmm/ocr/${msg.purpose}:result`, data: ret.data,
          purpose: msg.purpose, [msg.purpose]: msg[msg.purpose],
        });
      }
    });
  }

  class Rectangle {
    public size: { w: number, h: number };
    public start: { x: number, y: number };
    constructor(w: number, h: number, x = 0, y = 0) {
      this.size = { w, h };
      this.start = { x, y };
    }
    public static new(bounds: { width: number, height: number }): Rectangle {
      return new Rectangle(bounds.width, bounds.height);
    }
    public game(): Rectangle {
      const a = this.size.h / this.size.w;
      const r = GameRawHeight / GameRawWidth;
      if (a - r > 0) return new Rectangle(this.size.w, this.size.w * r, 0, (this.size.h - (this.size.w * r)) / 2); // タテなが
      else if (a - r < 0) return new Rectangle(this.size.h / r, this.size.h, (this.size.w - (this.size.h / r)) / 2, 0); // ヨコなが
      return this;
    }
    public purpose(purpose: string, params: Record<string, unknown> = {}): Rectangle {
      switch (purpose) {
      case "recovery": return this.recovery();
      case "shipbuild": return this.shipbuild(params.dock as number);
      default: return this.recovery();
      }
    }
    public recovery(): Rectangle {
      const g = this.game();
      return new Rectangle(
        g.size.w * (1 / 8),
        g.size.h * (36 / 720),
        g.start.x + (g.size.w * (55 / 100)),
        g.start.y + (g.size.h * (57 / 100)),
      );
    }
    public shipbuild(dock: number): Rectangle {
      const g = this.game();
      // ドックひとつずれたときのY開始位置
      const dockOffset = g.size.h * (120 / 720);
      return new Rectangle(
        g.size.w * (148 / 1200),
        g.size.h * (32 / 720),
        g.start.x + (g.size.w * (592 / 1200)),
        g.start.y + (g.size.h * (268 / 720)) + ((dock - 1) * dockOffset),
      );
    }
  }

  function load(uri: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = uri;
    });
  }

  function crop(image: HTMLImageElement, rect: Rectangle): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = rect.size.w;
    canvas.height = rect.size.h;
    ctx.drawImage(image, rect.start.x, rect.start.y, rect.size.w, rect.size.h, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.5);
  }

  async function ocr(url: string, params: Partial<WorkerParams> = { tessedit_char_whitelist: "0123456789:" }): Promise<RecognizeResult> {
    const worker = await createWorker('eng');
    worker.setParameters(params);
    const ret = await worker.recognize(url);
    worker.terminate();
    return ret;
  }

})();
