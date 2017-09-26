/**
 * 通知がクリックされた時に発火するコントローラ群
 */
import Frame          from "../../Models/Frame";
import History        from "../../Models/History";
import LaunchPosition from "../../Models/LaunchPosition";

import NotificationService from "../../../Services/NotificationService";
import WindowService       from "../../../Services/WindowService";

const notifications = new NotificationService();
const windows = WindowService.getInstance();

function OnNotificationClicked(id) {
  // まずこの通知は消す
  notifications.clear(id);

  const lastSelectedFrame = History.find("last-selected-frame");
  const frame = Frame.find(lastSelectedFrame.id);
  const position = LaunchPosition.find("default");

  return windows.find(true)
    .then(tab => windows.focus(tab))
    // .then(win => windows.resize(win, frame.size, position.architrave))
    .catch(() => windows.open(frame, position))
    .then(win => windows.mute(win.tabs[0], History.find("last-muted-status").muted));
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
