import WindowService from "../../Services/WindowService";

export function onHomePort(/* detail */) {
    let windows = WindowService.getInstance();
    windows.find().then(tab => {
        chrome.tabs.sendMessage(tab.id, {action:"/snapshot/hide"});
    });
    windows.getDamageSnapshot().then(tabs => {
        tabs.map(tab => chrome.tabs.sendMessage(tab.id, {action:"/snapshot/hide"}));
    });
}
