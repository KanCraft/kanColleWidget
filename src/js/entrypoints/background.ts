/// <reference types="chrome" />

import MessageListener from "../Applications/Background/Routers/Message";
chrome.runtime.onMessage.addListener(MessageListener);

import WebRequestListener from "../Applications/Background/Routers/WebRequest";
chrome.webRequest.onBeforeRequest.addListener(WebRequestListener, { urls: ["*://*/kcsapi/*"] }, ["requestBody"]);

import WebRequestOnCompleteListener from "../Applications/Background/Routers/WebRequestOnComplete";
chrome.webRequest.onCompleted.addListener(WebRequestOnCompleteListener, { urls: ["*://*/kcsapi/*"] });

chrome.alarms.clearAll();
import AlarmsListener from "../Applications/Background/Routers/Alarms";
chrome.alarms.onAlarm.addListener(AlarmsListener);

import NotificationClickListener from "../Applications/Background/Routers/NotificationClick";
chrome.notifications.onClicked.addListener(NotificationClickListener);

import {UpdateQueues} from "../Applications/Background/Cron";
setInterval(UpdateQueues, 5 * 1000);
