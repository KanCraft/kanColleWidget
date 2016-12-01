/* global sleep:false */

import WindowService from "../../Services/WindowService";
import CaptureService from "../../Services/CaptureService";
import Rectangle from "../../Services/Rectangle";
const windows = WindowService.getInstance();
const capture = new CaptureService();

export function onBattleResulted(detail) {
    sleep(3.1).then(windows.find.bind(windows)).then(tab => {
        return capture.capture(tab.windowId);
    }).then(Image.init).then(img => {
        // ここの、「全体のURIをもらって、Rectを決めて、URIをconvertする」っていうの、ルーチンなのでどっかにやる
        let rect = (new Rectangle(0, 0, img.width, img.height)).removeBlackspace().shipsStatus();
        let canvas = document.createElement("canvas");
        canvas.width = rect.width; canvas.height = rect.height;
        canvas.getContext("2d").drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
        return Promise.resolve(canvas.toDataURL());
    }).then(uri => {
        // chomexのclientでどうにかしてくれ
        chrome.tabs.sendMessage(detail.tabId, {action:"/snapshot/show", uri});
        // sstwManager.openByImageURI(uri);
    });
}

export function onCombinedBattleResulted(detail) {
    chrome.tabs.sendMessage(detail.tabId, {action:"/snapshot/prepare"});
}

export function onBattleStarted(/* detail */) {
    WindowService.getInstance().find().then(tab => {
        chrome.tabs.sendMessage(tab.id, {action:"/snapshot/hide"});
    });
    // sstwManager.sweep();
}
