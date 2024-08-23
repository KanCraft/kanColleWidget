import { Logger, LogLevel } from "chromite";
Logger.global.level(LogLevel.DEBUG);

import Alarm from './controllers/Alarm';
chrome.alarms.onAlarm.addListener(Alarm.listener());

import { onBeforeRequest } from './controllers/WebRequest';
chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest.listener(), { urls: ["<all_urls>"] }, ["requestBody"]);

import { onInstalled } from "./controllers/Runtime";
chrome.runtime.onInstalled.addListener(onInstalled);

// queueを見てるcronを起動
chrome.alarms.create('/cron/queues', { periodInMinutes: 0.5 });
