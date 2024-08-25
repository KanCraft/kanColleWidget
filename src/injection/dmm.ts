// 基本 type import しか許可しない
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
})();
