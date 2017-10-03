/* global sleep:false */
import {Client} from "chomex";

import WindowService  from "../../../Services/WindowService";
import CaptureService from "../../../Services/CaptureService";
import Rectangle      from "../../../Services/Rectangle";
import SortieContext  from "../../../Services/SortieContext";
const windows = WindowService.getInstance();
const capture = new CaptureService();

import Config         from "../../Models/Config";
import LaunchPosition from "../../Models/LaunchPosition";

function notifySortieContextTitle() {
  WindowService.getInstance().find(true).then(tab => {
    Client.for(chrome.tabs, tab.id).message("/area/update", {
      context: SortieContext.sharedInstance(),
      title: SortieContext.sharedInstance().toContextTitle(),
    });
  });
}

function getWindowForDamageSnapshot(detail, uri) {
  let position = LaunchPosition.find("dsnapshot");
  switch (Config.find("damagesnapshot-window").value) {
  case "separate":
    return windows.openDamagaSnapshot(position).then(({tabs:[tab]}) => Promise.resolve(tab));
  case "inwindow":
    return Promise.resolve({id:detail.tabId});
  case "notification":
    SortieContext.sharedInstance().damagesnapshot(uri);
    return Promise.resolve(null);
  case "disabled":
  default:
    return Promise.resolve(null);
  }
}

export function onBattleResulted(detail) {
  // TODO: この"disabled"っていうのもConstにしたい
  if (Config.find("damagesnapshot-window").value == "disabled") return;
  sleep(3.1).then(windows.find.bind(windows)).then(tab => {
    return capture.capture(tab.windowId);
  }).then(Image.init).then(img => {
    // ここの、「全体のURIをもらって、Rectを決めて、URIをconvertする」っていうの、ルーチンなのでどっかにやる
    let rect = (new Rectangle(0, 0, img.width, img.height)).removeBlackspace().shipsStatus();
    let canvas = document.createElement("canvas");
    canvas.width = rect.width; canvas.height = rect.height;
    canvas.getContext("2d").drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
    return Promise.resolve(canvas.toDataURL());
  }).then(uri => {
    return Promise.all([Promise.resolve(uri), getWindowForDamageSnapshot(detail, uri)]);
  }).then(([uri, tab]) => {
    if (!tab) return;
    sleep(0.2).then(() => {
      chrome.tabs.sendMessage(tab.id, {action:"/snapshot/show", uri});
    });
  });
}

export function onCombinedBattleResulted(detail) {
  // TODO: この"disabled"っていうのもConstにしたい
  if (Config.find("damagesnapshot-window").value == "disabled") return;
  let position = LaunchPosition.find("dsnapshot");

  // とりあえずprepareはする
  chrome.tabs.sendMessage(detail.tabId, {action:"/snapshot/prepare"});

  switch (Config.find("damagesnapshot-window").value) {
  case "separate": windows.openDamagaSnapshot(position, 2);
  }
  return true;
}

export function onCombinedBattleStarted(req) {
  SortieContext.sharedInstance().battle();
  // 大破進撃防止表示を消す
  windows.getDamageSnapshot().then(tabs => tabs.map(tab => chrome.tabs.sendMessage(tab.id, {action:"/snapshot/hide"})));
  // 大破進撃防止表示を消す
  chrome.tabs.sendMessage(req.tabId, {action:"/snapshot/hide"});
  // 必要があれば出撃海域表示
  if (Config.find("display-map-info").value) notifySortieContextTitle();
}

export function onBattleStarted(req) {
  SortieContext.sharedInstance().battle();
  // 大破進撃防止表示を消す
  windows.getDamageSnapshot().then(tabs => tabs.map(tab => chrome.tabs.sendMessage(tab.id, {action:"/snapshot/hide"})));
  // 大破進撃防止表示を消す
  chrome.tabs.sendMessage(req.tabId, {action:"/snapshot/hide"});
  // 必要があれば出撃海域表示
  console.log("onBattleStarted", Config.find("display-map-info"));
  if (Config.find("display-map-info").value) notifySortieContextTitle();
}
