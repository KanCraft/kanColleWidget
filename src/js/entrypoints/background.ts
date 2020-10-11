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
  OnInstalledListener,
  OnUpdateAvailableListener,
} from "../Applications/Background/Routers/Runtime";
chrome.runtime.onUpdateAvailable.addListener(OnUpdateAvailableListener);
chrome.runtime.onInstalled.addListener(OnInstalledListener);

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
