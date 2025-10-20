import { createWorker, OEM, type RecognizeResult, type WorkerParams } from 'tesseract.js';
// import { Rectangle, load, crop } from './crop';

(async () => {
  // const GameIFrame = "iframe#game_frame";

  (async function __main__() {
    resize();
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
