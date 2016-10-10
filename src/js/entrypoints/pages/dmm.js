import {FRAME_SHIFT, EXTRACT} from "../../Components/Constants";
import ExtractFlash from "../../Components/Routine/ExtractFlash";
import {DecorateDMMPage} from "../../Components/Routine/DecoratePage";

chrome.runtime.connect();

import {Client} from "chomex";
const client = new Client(chrome.runtime);
client.message({act: "/window/should-decorate"}, true).then((res) => {
  // いずれにしもてこれは必要っぽいなと
    window.resizeBy(
      window.outerWidth - window.innerWidth,
      window.outerHeight - window.innerHeight
    );

    switch(res.tab.frame.decoration) {
    case FRAME_SHIFT:
        DecorateDMMPage.init(window).decorate();
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
}, 5 * 60 * 1000);
