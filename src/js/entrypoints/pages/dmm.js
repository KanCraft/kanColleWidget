import {FRAME_SHIFT, EXTRACT} from "../../Components/Constants";
import ExtractFlash from "../../Components/Routine/ExtractFlash";
import {DecorateDMMPage} from "../../Components/Routine/DecoratePage";
import DamageSnapshotDisplay from "../../Components/Routine/DamageSnapshot";

chrome.runtime.connect();

import {Client, Router} from "chomex";
const client = new Client(chrome.runtime);
client.message({act: "/window/should-decorate"}, true).then((res) => {

    window.resizeBy(
      window.outerWidth - window.innerWidth,
      window.outerHeight - window.innerHeight
    );

    switch(res.tab.frame.decoration) {
    case FRAME_SHIFT:
        DecorateDMMPage.init(window).decorate(res.tab.frame);
        client.message("/window/zoom:set", {zoom: res.tab.frame.zoom});
        break;
    case EXTRACT:
        var routine = ExtractFlash.init(window);
        routine.onload().then(iframe => routine.replace(iframe));
        break;
    default:
        alert(`UNKNOWN DECORATION: ${res.data.decoration}`);
    }
});

// Routineとか使ってもうちょっと抽象化しましょう
setInterval(() => {
    client.message("/launchposition/:update", {
        left: window.screenX,
        top:  window.screenY,
    });
}, 60 * 1000);

let snapshot = new DamageSnapshotDisplay();
let router = new Router();
router.on("/snapshot/:show", (message) => snapshot.show(message.uri));
router.on("/snapshot/:hide", () => snapshot.remove());
chrome.runtime.onMessage.addListener(router.listener());
