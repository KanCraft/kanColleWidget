import {Client} from "chomex";
import Const from "../Constants";

async function main() {
  const client = new Client(chrome.runtime, false);
  const {status, data} = await client.message("/window/decoration");
  if (status < 200 && 300 <= status) {
    return; // do nothing
  }
  if (!data) {
    return; // do nothing
  }

  // エアロ領域の計算と微調整
  const {tab, frame} = data;
  window.resizeBy(
    window.outerWidth - Math.floor(window.innerWidth * frame.zoom),
    window.outerHeight - Math.floor(window.innerHeight * frame.zoom),
  );

  // ゲーム領域を画面ぴったりにずらす
  const iframe = document.querySelector(Const.GameIFrame) as HTMLIFrameElement;
  const rect = iframe.getBoundingClientRect() as DOMRect;
  iframe.style.position = "relative";
  iframe.style.left = "0";
  iframe.style.top = `-${rect.y + Const.TopSpacing}px`;

}

window.onload = main;
