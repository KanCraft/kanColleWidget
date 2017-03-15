import WindowService from "../../Services/WindowService";
import SortieContext from "../../Services/SortieContext";

export function onHomePort(/* detail */) {
  let windows = WindowService.getInstance();
  windows.find().then(tab => {
    chrome.tabs.sendMessage(tab.id, {action:"/snapshot/hide"});
  });
  windows.getDamageSnapshot().then(tabs => {
    tabs.map(tab => chrome.tabs.sendMessage(tab.id, {action:"/snapshot/hide"}));
  });

  SortieContext.sharedInstance().sweepsnapshot();
}

// とりあえずここでいいや
import Resource from "../../Models/Resource";
export function onDeck() {
  Resource.tracker().snapshot();
}
