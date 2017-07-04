/**
 * このスクリプトは、DMM管理下の『艦これ』画面において評価される。
 * "EXTRACT"の場合は、すぐに死ぬ
 */

import {FRAME_SHIFT, EXTRACT} from "../../Components/Constants";
import ExtractFlash from "../../Components/Routine/ExtractFlash";
import {DecorateDMMPage} from "../../Components/Routine/DecoratePage";
import LaunchPositionRecorder from "../../Components/Routine/LaunchPositionRecorder";
import InAppActionButtons from "../../Components/Routine/InAppActionButtons";
import {Client} from "chomex";
const client = new Client(chrome.runtime);

// このページを修飾するかどうかは必ずbackgroundに、background管理下のページかどうか聞く
client.message("/window/should-decorate").then((res) => {

  // XXX: https://github.com/otiai10/kanColleWidget/issues/726
  // XXX: なんでかしらんけど、ブラウザの機能でzoomをいじってると、
  // XXX: innerXXXのほうが、1/zoomの割合で取得できるので、元に戻して
  // XXX: エアロ領域の計算をする（いみわかんね）
  const innerWidth  = Math.floor(window.innerWidth * res.zoom);
  const innerHeight = Math.floor(window.innerHeight * res.zoom);

  // decorationがFRAME_SHIFT,EXTRACTかに問わず、サイズはここで修正する
  window.resizeBy(
    // エアロ領域分大きくして、コンテンツサイズを指定の大きさに合わせる
    window.outerWidth - innerWidth,
    window.outerHeight - innerHeight
  );

  let onBeforeUnloadFuncs = [];

  console.log("should-decorate?", res, res.tab, res.tab.frame, res.tab.frame.decoration);

  switch(res.tab.frame.decoration) {

  // "FRAME_SHIFT"
  // dmm.comのページにとどまり、
  //   1) HTMLの修飾をする
  //   2) Flashの位置を固定する
  case FRAME_SHIFT:

    onBeforeUnloadFuncs.push(() => { client.message("/sync/save"); return false; });

    DecorateDMMPage.init(window).decorate(res.tab.frame);
    client.message("/window/zoom:set", {zoom: res.tab.frame.zoom});

    // 窓位置の記憶をする
    (new LaunchPositionRecorder(client)).mainGameWindow(60 * 1000);

    // context:"auto"として、いずれにしてもautoloadを試みる。必要不必要はControllerで判断
    client.message("/sync/load", {context:"auto"});

    // ゲーム内ボタンを出現させる
    // TODO: /config/get で複数の設定値を一気に取れるように。keyじゃなくてkeysにすべき。
    client.message("/config/get", {key: "use-inapp-action-buttons"}).then(({data}) => {
      if (data.value) client.message("/window/self", ({self}) => {
        const buttons = (new InAppActionButtons(client)).setContext(self).html();
        document.body.appendChild(buttons);
      });
    });

    // ゲーム閉じるアラートを登録する
    client.message("/config/get", {key:"alert-on-before-unload"}).then(({data}) => {
      if (data.value) onBeforeUnloadFuncs.push(() => true);
    });

    // いずれにしても、onbeforeunloadは登録する
    window.onbeforeunload = () => onBeforeUnloadFuncs.some(f => f()) ? true : null;

    break;

  // "EXTRACT"
  // dmm.com内部のGame部分iframeのURLへ移動する
  case EXTRACT:
    var routine = ExtractFlash.init(window);
    routine.onload().then(iframe => routine.replace(iframe));
    break;

  // 不明なdecorationの場合は何もしない
  default:
    alert(`UNKNOWN DECORATION: ${res.data.decoration}`);
  }
});
