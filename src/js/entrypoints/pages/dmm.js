import {FRAME_SHIFT, EXTRACT} from "../../Components/Constants";
import ExtractFlash from "../../Components/Routine/ExtractFlash";
import {DecorateDMMPage} from "../../Components/Routine/DecoratePage";
import LaunchPositionRecorder from "../../Components/Routine/LaunchPositionRecorder";

chrome.runtime.connect();

import {Client} from "chomex";
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
        (new LaunchPositionRecorder(client)).mainGameWindow(60 * 1000);
        break;
    case EXTRACT:
        var routine = ExtractFlash.init(window);
        routine.onload().then(iframe => routine.replace(iframe));
        break;
    default:
        alert(`UNKNOWN DECORATION: ${res.data.decoration}`);
    }
});
