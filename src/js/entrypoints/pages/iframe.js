/**
 * このスクリプトは大破進撃防止窓のためだけに使う
 * embedタグのonclickをとらなきゃいけないので、all_frames:trueでosapi.dmm.comで有効
 */
import {Router, Client} from "chomex";
import DamageSnapshotDisplay from "../../Components/Routine/DamageSnapshot";

const _setupDamageSnapshot = (client) => {
  const snapshot = new DamageSnapshotDisplay(client);
  let router = new Router();
  router.on("/snapshot/show", (message) => snapshot.show(message.uri));
  router.on("/snapshot/hide", () => snapshot.remove());
  router.on("/snapshot/prepare", () => snapshot.prepare());
  chrome.runtime.onMessage.addListener(router.listener());
};

const init = () => {
  const KANCOLLE_DMM_APP_ID = "854854";
  const url = new URL(window.location.href);
  if (url.searchParams.get("aid") != KANCOLLE_DMM_APP_ID) return "Do Nothing";
  const client = new Client(chrome.runtime);
  client.message("/window/should-decorate").then(() => _setupDamageSnapshot(client));
};

setTimeout(() => init(), 100);
