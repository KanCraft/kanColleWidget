// import { Router, SerialRouter, Logger } from "chomex";

// タイマーなんかを監視するintervalをスタート
import QueueObserver from "../Components/Routine/QueueObserver";
QueueObserver.start();

// sendMessageを受けるroutesを定義
import MessageListener from "../Components/Routes/MessageRoutes";
chrome.runtime.onMessage.addListener(MessageListener);

// HTTP Requestを受けるroutesを定義
import {WebRequestListener} from "../Components/Routes/WebRequestRoutes";
chrome.webRequest.onBeforeRequest.addListener(
  WebRequestListener, {"urls":["*://*/kcsapi/*"]}, ["requestBody"]
);

// HTTP Requestが完了したときのroutesを定義
import {WebRequestOnCompleteListener} from "../Components/Routes/WebRequestOnCompleteRoutes";
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

// 外部Chrome拡張からのsendMessageを受けるroutesの定義
import ExternalMessageRouter from "../Components/Routes/ExternalMessageRoutes";
chrome.runtime.onMessageExternal.addListener(ExternalMessageRouter);

import {init} from "./global-pollution";
init(window);
