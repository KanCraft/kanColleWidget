// import { Router, SerialRouter, Logger } from "chomex";

// タイマーなんかを監視するintervalをスタート
import QueueObserver from "../Components/Routine/QueueObserver";
QueueObserver.start();

// sendMessageを受けるroutesを定義
import MessageListener from "../Components/Routes/MessageRoutes";
chrome.runtime.onMessage.addListener(MessageListener);

// HTTP Requestを受けるroutesを定義
import {WebRequestListener, WebRequestOnCompleteListener} from "../Components/Routes/WebRequestRoutes";
chrome.webRequest.onBeforeRequest.addListener(
  WebRequestListener, {"urls":["*://*/kcsapi/*"]}, ["requestBody"]
);
chrome.webRequest.onCompleted.addListener(
  WebRequestOnCompleteListener, {"urls":["*://*/kcsapi/*"]}, []
);

// NotificationのonClickを受けるroutesを定義
import NotificationClickListener from "../Components/Routes/NotificationClickRoutes";
chrome.notifications.onClicked.addListener(NotificationClickListener);

import NotificationButtonClickListener from "../Components/Routes/NotificationButtonClickRoutes";
chrome.notifications.onButtonClicked.addListener(NotificationButtonClickListener);

// Commandsを受けるroutersの定義
import CommandRouter from "../Components/Routes/CommandRoutes";
chrome.commands.onCommand.addListener(CommandRouter);

import {init} from "./global-pollution";
init(window);

import Quest from "../Components/Models/Quest";
console.log(Quest.daily());
console.log(Quest.daily(false));
