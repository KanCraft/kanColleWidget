/**
 * 通知がクリックされた時に発火するコントローラ群
 */
import Frame from "../../Models/Frame";
import History from "../../Models/History";
import NotificationService from "../../Services/NotificationService";
import WindowService from "../../Services/WindowService";
import LaunchPosition from "../../Models/LaunchPosition";

const notifications = new NotificationService();
const windows = WindowService.getInstance();

function OnNotificationClicked(id) {
  // まずこの通知は消す
  notifications.clear(id);
  // すでに存在してる窓を探す
  windows.find(true).then(tab => {
    // あればそれをフォーカスするだけにする
    windows.focus(tab);
  }).catch(() => {
    // なければ最後に選択されたFrameをもとに作る
    // TODO: この`lastSelectedFrame`が`position`みたいなプロパティを持っている必要がある
    const lastSelectedFrame = History.find("last-selected-frame");
    const frame = Frame.find(lastSelectedFrame.id);
    const position = LaunchPosition.find("default");
    windows.open(frame, position);
  });
}

export function OnMissionNotificationClicked(id) {
  return OnNotificationClicked(id);
}

export function OnRecoveryNotificationClicked(id) {
  return OnNotificationClicked(id);
}

export function OnCreateshipNotificationClicked(id) {
  return OnNotificationClicked(id);
}

export function OnTirednessNotificationClicked(id) {
  return OnNotificationClicked(id);
}

export function OnDebugNotificationClicked(id) {
  notifications.clear(id);
}

export function OnStrictMissionWarningClicked(id) {
  return OnNotificationClicked(id);
}
