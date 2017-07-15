/**
 * このスクリプトは、DMM管理下の『艦これ』画面において評価される。
 * "EXTRACT"の場合は、すぐに死ぬ
 */

import {FRAME_SHIFT, EXTRACT} from "../../Components/Constants";
import ExtractFlash from "../../Components/Routine/ExtractFlash";
import {DecorateDMMPage} from "../../Components/Routine/DecoratePage";
import Main from "../../Components/Routine/Main";

import {Client} from "chomex";
const client = new Client(chrome.runtime);

// このページを修飾するかどうかは必ずbackgroundに、background管理下のページかどうか聞く
client.message("/window/should-decorate").then((res) => {
  // decorationがFRAME_SHIFT,EXTRACTかに問わず、サイズはここで修正する
  // XXX: https://github.com/otiai10/kanColleWidget/issues/726
  window.resizeBy(
    window.outerWidth - Math.floor(window.innerWidth * res.zoom),
    window.outerHeight -  Math.floor(window.innerHeight * res.zoom)
  );

  switch(res.tab.frame.decoration) {
  case FRAME_SHIFT:
    client.message("/window/zoom:set", {zoom: res.tab.frame.zoom});
    (new Main(
      window,
      client,
      new DecorateDMMPage(window, res.tab.frame)
    )).main();
    break;
  case EXTRACT:
    var routine = ExtractFlash.init(window);
    routine.onload().then(iframe => routine.replace(iframe));
    break;
  // 不明なdecorationの場合は何もしない
  default:
    alert(`UNKNOWN DECORATION: ${res.data.decoration}`);
  }
});
