import { Logger, LogLevel } from "chromite";
Logger.global.level(LogLevel.DEBUG);

import Alarm from './controllers/Alarm';
chrome.alarms.onAlarm.addListener(Alarm.listener());

import { onBeforeRequest } from './controllers/WebRequest';
chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest.listener(), { urls: ["<all_urls>"] }, ["requestBody"]);

import { onInstalled } from "./controllers/Runtime";
chrome.runtime.onInstalled.addListener(onInstalled);

import { onClicked } from "./controllers/Notifications";
chrome.notifications.onClicked.addListener(onClicked.listener());

// queueを見てるcronを起動
chrome.alarms.create('/cron/queues', { periodInMinutes: 0.5 });

import { Launcher } from "./services/Launcher";
import { Frame } from "./models/Frame";
(async () => {
  const launcher = new Launcher();
  const frame = await Frame.memory();
  launcher.launch(frame);
})();