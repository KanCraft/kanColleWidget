import {Router} from "chomex";
import {DecorateOsapiPage} from "../../Components/Routine/DecoratePage";
import DamageSnapshotDisplay from "../../Components/Routine/DamageSnapshot";
import LaunchPositionRecorder from "../../Components/Routine/LaunchPositionRecorder";
import InAppActionButtons from "../../Components/Routine/InAppActionButtons";

chrome.runtime.connect();

import {Client} from "chomex";
const client = new Client(chrome.runtime);

DecorateOsapiPage.init(window).effort();

// これが必要かどうかは聞く必要がある
client.message("/config/get", {key: "use-inapp-action-buttons"}).then(({data}) => {
    if (!data.value) return; // Do nothing
    client.message("/window/self", ({self}) => {
        let inAppActionButtons = new InAppActionButtons(self, client);
        document.body.appendChild(inAppActionButtons.html());
    });
});

(new LaunchPositionRecorder(client)).mainGameWindow(60 * 1000);

let snapshot = new DamageSnapshotDisplay(client);
let router = new Router();
router.on("/snapshot/show", (message) => snapshot.show(message.uri));
router.on("/snapshot/hide", () => snapshot.remove());
router.on("/snapshot/prepare", () => snapshot.prepare());
chrome.runtime.onMessage.addListener(router.listener());
