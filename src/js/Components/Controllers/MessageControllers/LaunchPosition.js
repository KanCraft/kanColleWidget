import LaunchPosition from "../../Models/LaunchPosition";

function updateLaunchPosition(name, message) {
  let position = LaunchPosition.find(name);
  position.left = message.left;
  position.top  = message.top;
  position.height = message.height;
  position.width  = message.width;
  position.architrave = message.architrave || {};
  position.save();
}

export function UpdateLaunchPosition(message) {
  updateLaunchPosition("default", message);
  return true;
}

export function UpdateDashboardLaunchPosition(message) {
  updateLaunchPosition("dashboard", message);
  return true;
}

export function UpdateDamageSnapshotLaunchPosition(message) {
  updateLaunchPosition("dsnapshot", message);
  return true;
}
