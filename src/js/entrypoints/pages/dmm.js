import {FRAME_SHIFT, EXTRACT} from "../../Components/Constants";
import ExtractFlash from "../../Components/Routine/ExtractFlash";
import {DecorateDMMPage} from "../../Components/Routine/DecoratePage";
import LaunchPositionRecorder from "../../Components/Routine/LaunchPositionRecorder";

chrome.runtime.connect();

import {Client} from "chomex";
const client = new Client(chrome.runtime);
client.message("/window/should-decorate").then((res) => {

    // XXX: https://github.com/otiai10/kanColleWidget/issues/726
    // XXX: なんでかしらんけど、ブラウザの機能でzoomをいじってると、
    // XXX: innerXXXのほうが、1/zoomの割合で取得できるので、元に戻して
    // XXX: エアロ領域の計算をする（いみわかんね）
  const innerWidth  = Math.floor(window.innerWidth * res.zoom);
  const innerHeight = Math.floor(window.innerHeight * res.zoom);

    // エアロ領域分大きくして、コンテンツサイズを指定の大きさに合わせる
  window.resizeBy(
      window.outerWidth - innerWidth,
      window.outerHeight - innerHeight
    );

  let onBeforeUnloadFuncs = [() => {client.message("/sync/save");return false;}];

  switch(res.tab.frame.decoration) {
  case FRAME_SHIFT:
    DecorateDMMPage.init(window).decorate(res.tab.frame);
    client.message("/window/zoom:set", {zoom: res.tab.frame.zoom});
    (new LaunchPositionRecorder(client)).mainGameWindow(60 * 1000);
    client.message("/config/get", {key:"alert-on-before-unload"}).then(({data}) => {
      if (data.value) onBeforeUnloadFuncs.push(() => true);
    });
    window.onbeforeunload = () => onBeforeUnloadFuncs.map(f => f()).filter(r => !!r).length ? true : null;
    break;
  case EXTRACT:
    var routine = ExtractFlash.init(window);
    routine.onload().then(iframe => routine.replace(iframe));
    break;
  default:
    alert(`UNKNOWN DECORATION: ${res.data.decoration}`);
  }
});
