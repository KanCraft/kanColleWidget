import ShipsStatusTempWindowManager from "../../Services/ShipsStatusTempWindowManager";
import WindowService from "../../Services/WindowService";

export function onHomePort(/* detail */) {
    ShipsStatusTempWindowManager.getInstance().sweep();
    WindowService.getInstance().find().then(tab => {
        chrome.tabs.sendMessage(tab.id, {action:"/snapshot/hide"});
    });
}
