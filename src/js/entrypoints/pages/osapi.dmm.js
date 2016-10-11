import {DecorateOsapiPage} from "../../Components/Routine/DecoratePage";

chrome.runtime.connect();

import {Client} from "chomex";
const client = new Client(chrome.runtime);

DecorateOsapiPage.init(window).effort();

// Routineとか使ってもうちょっと抽象化しましょう
setInterval(() => {
    client.message("/launchposition/:update", {
        left: window.screenX,
        top:  window.screenY,
    });
}, 60 * 1000);
