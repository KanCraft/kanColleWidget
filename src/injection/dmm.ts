import { createWorker, OEM, type RecognizeResult, type WorkerParams } from 'tesseract.js';
import { type FrameParams } from "../models/Frame";
// import { Rectangle, load, crop } from './crop';

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
    sessionStorage.setItem("kancollewidget-frame-zoom", zoom.toString());
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { Rectangle, load, crop } = (window as any).KanColleWidget;
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
