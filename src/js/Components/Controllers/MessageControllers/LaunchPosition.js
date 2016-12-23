import LaunchPosition from "../../Models/LaunchPosition";

export function UpdateLaunchPosition(message) {
    let position = LaunchPosition.find("default");
    position.left = message.left;
    position.top  = message.top;
    position.save();
}

export function UpdateDashboardLaunchPosition(message) {
    let position = LaunchPosition.find("dashboard");
    position.left = message.left;
    position.top  = message.top;
    position.height = message.height;
    position.width  = message.width;
    position.save();
}
