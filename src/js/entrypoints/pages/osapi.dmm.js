/**
 * このスクリプトはすべての `http://osapi.dmm.com/gadgets/ifr*` URLパターンが
 * parentになっている場合においてのみ == ExtractFlash の結果として来る場合
 * だけ（と思われる）に有効
 */
import {Router} from "chomex";
import DamageSnapshotDisplay from "../../Components/Routine/DamageSnapshot";
import LaunchPositionRecorder from "../../Components/Routine/LaunchPositionRecorder";
import InAppActionButtons from "../../Components/Routine/InAppActionButtons";
import {DecorateOsapiPage} from "../../Components/Routine/DecoratePage";

import {Client} from "chomex";
const client = new Client(chrome.runtime);
const inAppActionButtons = new InAppActionButtons(client);

DecorateOsapiPage.init(window).effort();

// ゲーム内ボタンを出現させる
// TODO: /config/get で複数の設定値を一気に取れるように。keyじゃなくてkeysにすべき。
client.message("/config/get", {key: "use-inapp-action-buttons"}).then(({data}) => {
  if (!data.value) return; // Do nothing
  if (window.parent != window) return;
  client.message("/window/self", ({self}) => {
    const buttons = inAppActionButtons.setContext(self).html();
    document.body.appendChild(buttons);
  });
});

const saveBeforeUnload = () => { client.message("/sync/save"); return false; };
let onBeforeUnloadFuncs = [saveBeforeUnload];

// 閉じる前アラートが有効の場合はstopperを追加する
client.message("/config/get", {key:"alert-on-before-unload"}).then(({data}) => {
  const stopper = () => true;
  if (data.value) onBeforeUnloadFuncs.push(stopper);
});

// 登録されているonBeforeUnloadFuncsをすべて実行し、trueを返すものがあればアラートが出る
window.onbeforeunload = () => onBeforeUnloadFuncs.some(f => f()) ? true : null;

// context:"auto"として、いずれにしてもautoloadを試みる。必要不必要はControllerで判断
client.message("/sync/load", {context:"auto"});

(new LaunchPositionRecorder(client)).mainGameWindow(15 * 1000);

let snapshot = new DamageSnapshotDisplay(client);
let router = new Router();
router.on("/snapshot/show", (message) => snapshot.show(message.uri));
router.on("/snapshot/hide", () => snapshot.remove());
router.on("/snapshot/prepare", () => snapshot.prepare());

router.on("/mute/changed", ({muted}) => inAppActionButtons.muteChanged(muted));
chrome.runtime.onMessage.addListener(router.listener());
