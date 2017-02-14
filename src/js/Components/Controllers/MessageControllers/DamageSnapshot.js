/* global sleep:false */
import CaptureService from "../../Services/CaptureService";
import Rectangle      from "../../Services/Rectangle";
const capture = new CaptureService();
import WindowService from "../../Services/WindowService";
import Config from "../../Models/Config";

export function TakeDamageSnapshot() {
    return sleep(1.6)
    .then(() => capture.capture(this.sender.tab.windowId))
    .then(Image.init)
    .then(img => {
        // TODO: ここの、「全体のURIをもらって、Rectを決めて、URIをconvertする」っていうの、ルーチンなのでどっかにやる
        let rect = (new Rectangle(0, 0, img.width, img.height)).removeBlackspace().shipsStatusAfterClick();
        let canvas = document.createElement("canvas");
        canvas.width = rect.width; canvas.height = rect.height;
        canvas.getContext("2d").drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
        return Promise.resolve(canvas.toDataURL());
    }).then(uri => {
        switch (Config.find("damagesnapshot-window").value) {
        case "separate":
            return WindowService.getInstance().getDamageSnapshot().then(tabs => {
                tabs.map(tab => chrome.tabs.sendMessage(tab.id, {action: "/snapshot/show", uri}));
                return Promise.resolve(true);
            });
        case "inwindow":
            chrome.tabs.sendMessage(this.sender.tab.id, {
                action: "/snapshot/show", uri,
            });
            return Promise.resolve(true);
        case "disabled":
        default:
            return Promise.resolve(true);
        }
    });
}
