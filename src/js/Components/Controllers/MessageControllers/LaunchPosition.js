import LaunchPosition from "../../Models/LaunchPosition";

export function UpdateLaunchPosition(message) {
    let position = LaunchPosition.find("default");
    position.left = message.left;
    position.top  = message.top;
    position.save();
}
