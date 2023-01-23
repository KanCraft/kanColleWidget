/// <reference types="chrome" />
import "./global-pollution";

// {{{ 現状、設定画面のruntimeだけで完結しているので、ここでは必要ない
// import * as firebase from "firebase/app";
// import "firebase/auth";
// declare const FIREBASE_CONFIG: string;
// firebase.initializeApp(FIREBASE_CONFIG);
// }}}

import MessageListener from "../Applications/Background/Routers/Message";
chrome.runtime.onMessage.addListener(MessageListener);

import {
  OnUpdateAvailableListener,
} from "../Applications/Background/Routers/Runtime";
chrome.runtime.onUpdateAvailable.addListener(OnUpdateAvailableListener);

import WebRequestListener from "../Applications/Background/Routers/WebRequest";
chrome.webRequest.onBeforeRequest.addListener(WebRequestListener, { urls: ["*://*/kcsapi/*"] }, ["requestBody"]);

import WebRequestOnCompleteListener from "../Applications/Background/Routers/WebRequestOnComplete";
chrome.webRequest.onCompleted.addListener(WebRequestOnCompleteListener, { urls: ["*://*/kcsapi/*"] });

import NotificationClickListener from "../Applications/Background/Routers/NotificationClick";
chrome.notifications.onClicked.addListener(NotificationClickListener);

import CommandListener from "../Applications/Background/Routers/Command";
chrome.commands.onCommand.addListener(CommandListener);

import {UpdateQueues} from "../Applications/Background/Cron";
setInterval(UpdateQueues, 5 * 1000);

// {{{ MV3対応 (manifest version 3) localStorageにあるデータをすべてchrome.storage.localへ退避させる.
// TODO: Backgroundの起動時のみの発火としているが、ゲームウィンドウを閉じたときも発火すべきではないか.
(async () => {
  const major = parseInt(chrome.runtime.getManifest().version.split(".")[0]);
  if (major >= 4) return; // まだv4はリリースしていないが、v4になればこのコードはいらない
  const items: { [key: string]: any } = {};
  for (const key in localStorage) {
    // eslint-disable-next-line no-prototype-builtins
    if (!localStorage.hasOwnProperty(key)) continue;
    items[key] = JSON.parse(localStorage.getItem(key));
  }
  // console.log("[DEBUG] MV3対応:", items);
  chrome.storage.local.set(items, () => {
    // console.log("[DEBUG] set to local:", items);
  });
})();
// }}}