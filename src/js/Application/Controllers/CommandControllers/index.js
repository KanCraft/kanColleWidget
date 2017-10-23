
import TrimService    from "../../../Services/TrimService";
import Assets         from "../../../Services/Assets";
import Streaming      from "../../../Services/Streaming";
import WindowService  from "../../../Services/WindowService";
import CaptureService from "../../../Services/CaptureService";
const windows = WindowService.getInstance();
const captures = new CaptureService();

import LaunchPosition   from "../../Models/LaunchPosition";
import Config           from "../../Models/Config";
import History          from "../../Models/History";
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
    return Config.find("force-capture-default-size").value ? TrimService.initWithURI(uri).resize() : Promise.resolve(uri);
  }).then(uri => {
    if (Config.find("directly-download-on-capture").value) return assets.downloadImageURL(uri);
    else OpenCaptureWindow(uri);
  });
}

export function MuteController() {
  if (Streaming.active()) {
    // TODO: window.alertじゃなくてなにか
    window.alert("動画キャプチャが有効な状態でのミュート操作はできません");
    return true;
  }
  return windows.find().then(tab => {
    let h = History.find("last-muted-status");
    const muted = !tab.mutedInfo.muted;
    h.muted = muted;
    h.save();
    // Mute状態をToggleする
    windows.mute(tab, muted);
    // ゲーム画面にmutedを知らせる
    chrome.tabs.sendMessage(tab.id, {action: "/mute/changed", muted});
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
