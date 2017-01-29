import {Client, Router} from "chomex";
import DamageSnapshotDisplay from "../../Components/Routine/DamageSnapshot";

chrome.runtime.connect();

const client = new Client(chrome.runtime);

let snapshot = new DamageSnapshotDisplay(client);
let router = new Router();
router.on("/snapshot/show", (message) => snapshot.show(message.uri));
router.on("/snapshot/hide", () => window.close());
router.on("/snapshot/prepare", () => snapshot.prepare());
chrome.runtime.onMessage.addListener(router.listener());

setInterval(() => {
    client.message("/launchposition/dsnapshot/update", {
        height: window.outerHeight,
        width:  window.outerWidth,
        left:   window.screenX,
        top:    window.screenY,
    });
}, 1 * 1000);
