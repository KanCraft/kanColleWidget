import WindowService from "../../Services/WindowService";
import CaptureService from "../../Services/CaptureService";
// import {Client} from "chomex";
import Frame from "../../Models/Frame";
import History from "../../Models/History";
import LaunchPosition from "../../Models/LaunchPosition";

import Config from "../../Models/Config";
import Assets from "../../Services/Assets";
import CaptureWindowURL from "../../Routine/CaptureWindowURL";

const windows = WindowService.getInstance();
const captures = new CaptureService();
// const client = new Client(chrome.tabs);

import OCR from "../../Services/API/OCR";

export function OpenWindow(message) {

    let lastSelectedFrame = History.find("last-selected-frame");
    const id = message.frame || lastSelectedFrame.id;

    const frame = Frame.find(id);
    if (!frame) {
        alert(id);
        return;
    }

    // last-selected-frameとしてHistoryに保存する
    lastSelectedFrame.id = id;
    lastSelectedFrame.save();

    let position = LaunchPosition.find("default");

    return windows.find(true)
    .then(tab => windows.focus(tab))
    .then(win => windows.resize(win, frame.size, position.architrave))
    .catch(() => windows.open(frame, position))
    .then(win => windows.mute(win.tabs[0], History.find("last-muted-status").muted));
}

export function ShouldDecorateWindow(/* message */) {

    // Herokuのインスタンスが寝てたら起こす
    (new OCR()).status()
    .then(res => console.log("OK", res))
    .catch(err => console.log("NG", err));

    const tab = windows.has(this.sender.tab.id);
    if (tab) {
        // XXX: https://github.com/otiai10/kanColleWidget/issues/726
        // XXX: エアロ領域計算のためにzoom値が必要なので取得しといてあげる
        return new Promise(resolve => {
            chrome.tabs.getZoom(this.sender.tab.id, zoom => {
                resolve({status: 200, tab, zoom});
            });
        });
    } else {
        return {status: 404};
    }
}

export function CaptureWindow(/* message */) {
    return Promise.resolve().then(() => {
        return windows.find();
    }).then(tab => {
        return captures.capture(tab.windowId);
    });
}

export function GetMyself() {
    return {status: 200, self: this.sender};
}

export function MuteWindow(message) {
    return new Promise(resolve => {
        // TODO: chromeモジュールここで参照しないように
        chrome.tabs.update(message.tab.id, {muted: message.mute}, tab => {
            let h = History.find("last-muted-status");
            h.muted = tab.mutedInfo.muted;
            h.save();
            resolve({status: 200, tab});
        });
    });
}

export function ZoomWindow(message) {
    // あるべき「タブサイズ」
    const base = {
        width: 800 * parseFloat(message.zoom),
        height: 480 * parseFloat(message.zoom)
    };
    // 現在の「タブサイズ」
    const tab  = {
        width: this.sender.tab.width,
        height: this.sender.tab.height
    };
    // アドレスバーやエアロ領域によって生まれる「タブサイズ」の差分
    const diff = {
        width:  base.width - tab.width,
        height: base.height - tab.height,
    };
    // 現在のwindowの大きさを取得
    windows.get(this.sender.tab.windowId)
    // タブコンテンツの大きさは直接変えられないので、外枠（ウィンドウ）を変えることで実現
    .then(win => {
        chrome.windows.update(win.id, {
            width:  win.width + diff.width,
            height: win.height + diff.height,
        });
    });
    return windows.zoom(this.sender.tab.id, message.zoom);
}

export function CurrentActionForWindow() {
    let assets = new Assets(Config);
    let frame = Frame.find(History.find("last-selected-frame").id);
    let position = LaunchPosition.find("default");
    return windows.find(true)
    .then(windows.focus.bind(windows))
    .then(captures.capture.bind(captures))
    .then(uri => {
        if (Config.find("directly-download-on-capture").value) return assets.downloadImageURL(uri);
        let url = new CaptureWindowURL(Date.now());
        url.params(uri).then(params => {
            window.open(chrome.extension.getURL("dest/html/capture.html") + "?" + params.toString());
        });
    })
    .catch(() => windows.open(frame, position));
}

export function OpenDashboard() {
    const position = LaunchPosition.find("dashboard");
    windows.openDashboard(position);
}
