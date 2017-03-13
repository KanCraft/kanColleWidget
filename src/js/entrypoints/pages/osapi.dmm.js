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
  let onBeforeUnloadFuncs = [() => {client.message("/sync/save");return false;}];
  client.message("/config/get", {key:"alert-on-before-unload"}).then(({data}) => {
    if (data.value) onBeforeUnloadFuncs.push(() => true);
  });
  window.onbeforeunload = () => onBeforeUnloadFuncs.map(f => f()).filter(r => !!r).length ? true : null;
});

(new LaunchPositionRecorder(client)).mainGameWindow(15 * 1000);

let snapshot = new DamageSnapshotDisplay(client);
let router = new Router();
router.on("/snapshot/show", (message) => snapshot.show(message.uri));
router.on("/snapshot/hide", () => snapshot.remove());
router.on("/snapshot/prepare", () => snapshot.prepare());

router.on("/mute/changed", ({muted}) => inAppActionButtons.muteChanged(muted));
chrome.runtime.onMessage.addListener(router.listener());
