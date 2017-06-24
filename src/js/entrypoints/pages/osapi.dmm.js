import {Router} from "chomex";
import {DecorateOsapiPage} from "../../Components/Routine/DecoratePage";
import DamageSnapshotDisplay from "../../Components/Routine/DamageSnapshot";
import LaunchPositionRecorder from "../../Components/Routine/LaunchPositionRecorder";
import InAppActionButtons from "../../Components/Routine/InAppActionButtons";

chrome.runtime.connect();

import {Client} from "chomex";
const client = new Client(chrome.runtime);

DecorateOsapiPage.init(window).effort();

let inAppActionButtons = new InAppActionButtons(client);

// これが必要かどうかは聞く必要がある
client.message("/config/get", {key: "use-inapp-action-buttons"}).then(({data}) => {
  if (!data.value) return; // Do nothing
  if (window.parent != window) return;
  client.message("/window/self", ({self}) => {
    inAppActionButtons.setContext(self);
    document.body.appendChild(inAppActionButtons.html());
  });
});

// いずれにしてもautosaveを予約する。必要不必要はControllerのほうで判断する
const fn = () => {client.message("/sync/save"); return false;};
let onBeforeUnloadFuncs = [fn];
client.message("/config/get", {key:"alert-on-before-unload"}).then(({data}) => {
  // 閉じる前アラートが有効の場合はstopperを追加する
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
