import {Router} from "chomex";
import {DecorateOsapiPage} from "../../Components/Routine/DecoratePage";
import DamageSnapshotDisplay from "../../Components/Routine/DamageSnapshot";

chrome.runtime.connect();

import {Client} from "chomex";
const client = new Client(chrome.runtime);

DecorateOsapiPage.init(window).effort(window != window.parent);

// Routineとか使ってもうちょっと抽象化しましょう
setInterval(() => {
    client.message("/launchposition/:update", {
        left: window.screenX,
        top:  window.screenY,
    });
}, 60 * 1000);

let snapshot = new DamageSnapshotDisplay(client);
let router = new Router();
router.on("/snapshot/show", (message) => snapshot.show(message.uri));
router.on("/snapshot/hide", () => snapshot.remove());
router.on("/snapshot/prepare", () => snapshot.prepare());
chrome.runtime.onMessage.addListener(router.listener());
