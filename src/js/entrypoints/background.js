// import { Router, SerialRouter, Logger } from "chomex";

// タイマーなんかを監視するintervalをスタート
import QueueObserver from "../Application/Routine/QueueObserver";
QueueObserver.start();

// sendMessageを受けるroutesを定義
import MessageListener from "../Application/Routes/MessageRoutes";
chrome.runtime.onMessage.addListener(MessageListener);

// HTTP Requestを受けるroutesを定義
import {WebRequestListener} from "../Application/Routes/WebRequestRoutes";
chrome.webRequest.onBeforeRequest.addListener(
  WebRequestListener, {"urls":["*://*/kcsapi/*"]}, ["requestBody"]
);

// HTTP Requestが完了したときのroutesを定義
import {WebRequestOnCompleteListener} from "../Application/Routes/WebRequestOnCompleteRoutes";
chrome.webRequest.onCompleted.addListener(
  WebRequestOnCompleteListener, {"urls":["*://*/kcsapi/*"]}, []
);

// NotificationのonClickを受けるroutesを定義
import NotificationClickListener from "../Application/Routes/NotificationClickRoutes";
chrome.notifications.onClicked.addListener(NotificationClickListener);

import NotificationButtonClickListener from "../Application/Routes/NotificationButtonClickRoutes";
chrome.notifications.onButtonClicked.addListener(NotificationButtonClickListener);

// Commandsを受けるroutersの定義
import CommandRouter from "../Application/Routes/CommandRoutes";
chrome.commands.onCommand.addListener(CommandRouter);

// 外部Chrome拡張からのsendMessageを受けるroutesの定義
import ExternalMessageRouter from "../Application/Routes/ExternalMessageRoutes";
chrome.runtime.onMessageExternal.addListener(ExternalMessageRouter);

// 右クリックして出て来るContextMenuをクリックしたときのイベントハンドラ
import ContextMenuClickListener, {createProperties} from "../Application/Routes/ContextMenuClickRoutes";
chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create(createProperties);
  chrome.contextMenus.onClicked.addListener(ContextMenuClickListener);
});

import {init} from "./global-pollution";
init(window);
