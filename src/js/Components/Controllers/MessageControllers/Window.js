import WindowService from "../../Services/WindowService";
import CaptureService from "../../Services/CaptureService";
// import {Client} from "chomex";
import Frame from "../../Models/Frame";
import History from "../../Models/History";
import LaunchPosition from "../../Models/LaunchPosition";

import Config from "../../Models/Config";
import Assets from "../../Services/Assets";

const windows = WindowService.getInstance();
const captures = new CaptureService();
// const client = new Client(chrome.tabs);

import OCR from "../../Services/API/OCR";

export function OpenWindow(message) {

    const id = message.frame;

    const frame = Frame.find(id);
    if (!frame) {
        alert(id);
        return;
    }

    // last-selected-frameとしてHistoryに保存する
    let lastSelectedFrame = History.find("last-selected-frame");
    lastSelectedFrame.id = id;
    lastSelectedFrame.save();
    // TODO: HistoryクラスってJS標準にあったので、AppHistoryとかにrenameする

    let position = LaunchPosition.find("default");

    return windows.find(true)
    .then(tab => windows.focus(tab))
    .catch(() => windows.open(frame, position));
}

export function ShouldDecorateWindow(/* message */) {

    // Herokuのインスタンスが寝てたら起こす
    (new OCR()).status()
    .then(res => console.log("OK", res))
    .catch(err => console.log("NG", err));

    const tab = windows.has(this.sender.tab.id);
    if (tab) {
        return {status: 200, tab: tab};
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

export function ZoomWindow(message) {
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
        let params = new URLSearchParams();
        params.set("img", uri);
        // TODO: Controllerでwindowオブジェクト参照したくないあな
        window.open(chrome.extension.getURL("dest/html/capture.html") + "?" + params.toString());
    })
    .catch(() => windows.open(frame, position));
}

export function OpenDashboard() {
    // TODO: Controllerでchromeネームスペースを参照するのはやめましょう
    chrome.windows.create({
        url: chrome.extension.getURL("dest/html/dashboard.html"),
        type: "popup",
        height: 292,
        width: 400,
    });
}
