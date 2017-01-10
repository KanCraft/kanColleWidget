import WindowService from "../../Services/WindowService";
const windows = WindowService.getInstance();
import CaptureService from "../../Services/CaptureService";
const captures = new CaptureService();

import LaunchPosition from "../../Models/LaunchPosition";
import Config from "../../Models/Config";
import Assets from "../../Services/Assets";

function OpenCaptureWindow(uri) {
    let params = new URLSearchParams();
    if (uri.length > 1 * Math.pow(10, 6)) {
        const hash = `kcw:tmp:deckimage:${Date.now()}`;
        // TODO: chrome直接参照〜
        chrome.storage.local.set({[hash]:uri}, () => {
            params.set("datahash", hash);
            window.open(chrome.extension.getURL("dest/html/capture.html") + "?" + params.toString());
        });
    } else {
        params.set("img", uri);
        window.open(chrome.extension.getURL("dest/html/capture.html") + "?" + params.toString());
    }
}

export function CaptureController() {
    const assets = new Assets(Config);
    windows.find().then(tab => {
        return captures.capture(tab.windowId);
    }).then(uri => {
        if (Config.find("directly-download-on-capture").value) return assets.downloadImageURL(uri);
        else OpenCaptureWindow(uri);
    });
}

export function MuteController() {
    windows.find().then(tab => {
        // Mute状態をToggleする
        windows.mute(tab, !tab.mutedInfo.muted);
    });
}

export function OpenDashboard() {
    const position = LaunchPosition.find("dashboard");
    windows.openDashboard(position);
}
