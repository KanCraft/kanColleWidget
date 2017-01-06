/* global sleep:false */

import WindowService from "../../Services/WindowService";
import CaptureService from "../../Services/CaptureService";
import Rectangle from "../../Services/Rectangle";
const windows = WindowService.getInstance();
const capture = new CaptureService();

import Config from "../../Models/Config";
import LaunchPosition from "../../Models/LaunchPosition";

function getWindowForDamageSnapshot(detail) {
    let position = LaunchPosition.find("dsnapshot");
    switch (Config.find("damageshapshot-window").value) {
    case "separate":
        return windows.openDamagaSnapshot(position).then(({tabs:[tab]}) => Promise.resolve(tab));
    case "inwindow":
        return Promise.resolve({id:detail.tabId});
    case "disabled":
    default:
        return Promise.resolve(null);
    }
}

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
        return Promise.all([Promise.resolve(uri), getWindowForDamageSnapshot(detail)]);
    }).then(([uri, tab]) => {
        if (!tab) return;// TODO: これ、けっきょくやんねえなら上の重い処理しなくてええやん
        sleep(0.2).then(() => {
            chrome.tabs.sendMessage(tab.id, {action:"/snapshot/show", uri});
        });
    });
}

export function onCombinedBattleResulted(detail) {
    chrome.tabs.sendMessage(detail.tabId, {action:"/snapshot/prepare"});
}

export function onCombinedBattleStarted(req) {
    chrome.tabs.sendMessage(req.tabId, {action:"/snapshot/hide"});
}

export function onBattleStarted(/* detail */) {
    windows.getDamageSnapshot().then(tabs => {
        tabs.map(tab => chrome.tabs.sendMessage(tab.id, {action:"/snapshot/hide"}));
    });
    WindowService.getInstance().find().then(tab => {
        chrome.tabs.sendMessage(tab.id, {action:"/snapshot/hide"});
    });
    // sstwManager.sweep();
}
