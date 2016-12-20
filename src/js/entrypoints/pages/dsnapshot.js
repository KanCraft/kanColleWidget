import {Router} from "chomex";
import DamageSnapshotDisplay from "../../Components/Routine/DamageSnapshot";

chrome.runtime.connect();

import {Client} from "chomex";
const client = new Client(chrome.runtime);

window.resizeBy(
  window.outerWidth - window.innerWidth,
  window.outerHeight - window.innerHeight
);

let snapshot = new DamageSnapshotDisplay(client);
let router = new Router();
router.on("/snapshot/show", (message) => snapshot.show(message.uri));
router.on("/snapshot/hide", () => window.close());
router.on("/snapshot/prepare", () => snapshot.prepare());
chrome.runtime.onMessage.addListener(router.listener());
