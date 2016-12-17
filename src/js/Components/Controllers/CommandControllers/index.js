import WindowService from "../../Services/WindowService";
const windows = WindowService.getInstance();
import CaptureService from "../../Services/CaptureService";
const captures = new CaptureService();

import LaunchPosition from "../../Models/LaunchPosition";
import Config from "../../Models/Config";
import Assets from "../../Services/Assets";

export function CaptureController() {
    const assets = new Assets(Config);
    windows.find().then(tab => {
        return captures.capture(tab.windowId);
    }).then(uri => {
        if (Config.find("directly-download-on-capture").value) return assets.downloadImageURL(uri);
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
    const position = LaunchPosition.find("dashboard");
    windows.openDashboard(position);
}
