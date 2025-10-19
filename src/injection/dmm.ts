import { createWorker, OEM, type RecognizeResult, type WorkerParams } from 'tesseract.js';
import { type FrameParams } from "../models/Frame";
// import { Rectangle, load, crop } from './crop';

(async () => {
  const GameRawWidth = 1200;
  const GameRawHeight = 720;
  const GameWrapper = "div#area-game";
  const GameIFrame = "iframe#game_frame";
  let resizetimeout: number;

  const Log = {
    app: "艦これウィジェット",
    brandStyle: "color: white; background-color: teal; padding: 2px 4px; border-radius: 2px;",
    context: "dmm.js",
    debug(...args: unknown[]) {
      console.debug(`%c[${this.app}]%c[${this.context}]`, this.brandStyle, "color: #0dcaf0;", ...args);
    },
    info(...args: unknown[]) {
      console.info(`%c[${this.app}]%c[${this.context}]`, this.brandStyle, "color: #0d6efd;", ...args);
    },
    warn(...args: unknown[]) {
      console.warn(`%c[${this.app}]%c[${this.context}]`, this.brandStyle, "color: #ffc107;", ...args);
    },
    error(...args: unknown[]) {
      console.error(`%c[${this.app}]%c[${this.context}]`, this.brandStyle, "color: #dc3545;", ...args);
    }
  } satisfies {
    app: string;
    brandStyle: string;
    context: string;
    debug: (...args: unknown[]) => void;
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
  };

  // sessionStorageに入ってくれているFrameParamsを取得
  const frame: FrameParams = JSON.parse(sessionStorage.getItem("kancollewidget-frame-jsonstr") || "{}");

  (async function __main__() {
    try {
      Log.info("[START] DMM版用スクリプトを起動");
      await waitUntilGameFrameLoaded(4000);
      resize();
      const fitted = fit(frame.zoom);
      if (!fitted) {
        Log.error("初期ズーム調整に失敗したため、スクリプトを中断します。DOM 構造の変化を確認してください。");
        return;
      }
      window.onresize = onresize;
      setInterval(track, 10 * 1000);
      startListeningMessage();
      Log.info("[DONE] DMM版用スクリプトの初期化が完了しました");
    } catch (error) {
      Log.error("DMM版用スクリプトの初期化中に例外が発生しました。", error);
    }
  })();

  /**
     * BazelというかAeroというか、を考慮して、ウィンドウのリサイズを行う
     */
  function resize() {
    // TODO: これだとなんか問題ありそう
    window.resizeBy(window.outerWidth - window.innerWidth, window.outerHeight - window.innerHeight);
  }

  async function waitUntilGameFrameLoaded(millisec: number = 2000): Promise<HTMLIFrameElement> {
    if (millisec <= 0) throw new Error("時間内にゲームフレームの読み込みが完了しませんでした。");
    Log.debug(`ゲームフレームの読み込み完了を待機中... 残り時間: ${millisec}ms`);
    const iframe = window.document.querySelector(GameIFrame) as HTMLIFrameElement | null;
    if (iframe && iframe.contentDocument && iframe.contentDocument.readyState === "complete") {
      return iframe;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    return await waitUntilGameFrameLoaded(millisec - 100);
  }

  /**
     * ズーム値に合わせてiframeをフィットさせゲーム領域をぴったり中央に表示する
     * @param zoom ズーム値
     */
  function fit(zoom: number) {
    sessionStorage.setItem("kancollewidget-frame-zoom", zoom.toString());
    const iframe = window.document.querySelector(GameIFrame) as HTMLIFrameElement | null;
    if (!iframe) {
      Log.error(`${GameIFrame} が見つかりません。別窓の DOM 構造が変更された可能性があります。`);
      return false;
    }
    iframe.style.position = "absolute";
    iframe.style.transition = "transform 0.2s";
    iframe.style.zIndex = "2";
    iframe.style.transform = `scale(${zoom})`;
    // コンテンツを中央に寄せる
    const wrapper = window.document.querySelector(GameWrapper) as HTMLDivElement | null;
    if (!wrapper) {
      Log.error(`${GameWrapper} が見つかりません。別窓の DOM 構造が変更された可能性があります。`);
      return false;
    }
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
    return true;
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

})();
