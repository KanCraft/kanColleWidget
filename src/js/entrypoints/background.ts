/// <reference types="chrome" />
import "./global-pollution";

import MessageListener from "../Applications/Background/Routers/Message";
chrome.runtime.onMessage.addListener(MessageListener);

import { RuntimeOnInstalledListener } from "../Applications/Background/Routers/Runtime";
chrome.runtime.onInstalled.addListener(RuntimeOnInstalledListener);

import WebRequestListener from "../Applications/Background/Routers/WebRequest";
chrome.webRequest.onBeforeRequest.addListener(WebRequestListener, { urls: ["*://*/kcsapi/*"] }, ["requestBody"]);

import WebRequestOnCompleteListener from "../Applications/Background/Routers/WebRequestOnComplete";
chrome.webRequest.onCompleted.addListener(WebRequestOnCompleteListener, { urls: ["*://*/kcsapi/*"] });

import {OnUpdateAvailable} from "../Applications/Background/Controllers/Meta";
chrome.runtime.onUpdateAvailable.addListener(OnUpdateAvailable);

import NotificationClickListener from "../Applications/Background/Routers/NotificationClick";
chrome.notifications.onClicked.addListener(NotificationClickListener);

import CommandListener from "../Applications/Background/Routers/Command";
chrome.commands.onCommand.addListener(CommandListener);

import {UpdateQueues} from "../Applications/Background/Cron";
setInterval(UpdateQueues, 5 * 1000);
