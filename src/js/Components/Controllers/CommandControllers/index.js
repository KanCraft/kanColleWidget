import WindowService from "../../Services/WindowService";
const windows = WindowService.getInstance();
import CaptureService from "../../Services/CaptureService";
const captures = new CaptureService();

import Config      from "../../Models/Config";
import FileService from "../../Services/Assets/FileService";

export function CaptureController() {
    const fs = new FileService(Config);
    windows.find().then(tab => {
        return captures.capture(tab.windowId);
    }).then(uri => {
        if (Config.find("directly-download-on-capture").value) return fs.downloadImageURL(uri);
        let params = new URLSearchParams();
        params.set("img", uri);
    // とりあえず
        window.open(chrome.extension.getURL("dest/html/capture.html") + "?" + params.toString());
    });
}

export function MuteController() {
    windows.find().then(tab => {
        // Mute状態をToggleする
        windows.mute(tab, !tab.mutedInfo.muted);
    });
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
