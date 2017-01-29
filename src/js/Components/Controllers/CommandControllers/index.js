import WindowService from "../../Services/WindowService";
const windows = WindowService.getInstance();
import CaptureService from "../../Services/CaptureService";
const captures = new CaptureService();

import LaunchPosition from "../../Models/LaunchPosition";
import Config from "../../Models/Config";
import History from "../../Models/History";
import Assets from "../../Services/Assets";
import Streaming from "../../Services/Streaming";

import CaptureWindowURL from "../../Routine/CaptureWindowURL";

function OpenCaptureWindow(uri) {
    let url = new CaptureWindowURL(Date.now());
    url.params(uri).then(params => {
        window.open(chrome.extension.getURL("dest/html/capture.html") + "?" + params.toString());
    });
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
        let h = History.find("last-muted-status");
        h.muted = !tab.mutedInfo.muted;
        h.save();
        // Mute状態をToggleする
        windows.mute(tab, !tab.mutedInfo.muted);
    });
}

export function OpenDashboard() {
    const position = LaunchPosition.find("dashboard");
    windows.openDashboard(position);
}

export function OpenStreaming() {
    Streaming.instance().then(streaming => {
        let params = new URLSearchParams();
        params.set("src", streaming.toBlobURL());
        window.open("/dest/html/stream.html" + "?" + params.toString());
    });
}
