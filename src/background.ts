import "./logger";

import Alarm from './controllers/Alarm';
chrome.alarms.onAlarm.addListener(Alarm.listener());
// queueを見てるcronを起動
chrome.alarms.create('/cron/queues', { periodInMinutes: 0.5 });

import { onBeforeRequest, onComplete } from './controllers/WebRequest';
chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest.listener(), { urls: ["*://*/kcsapi/*"] }, ["requestBody"]);
chrome.webRequest.onCompleted.addListener(onComplete.listener(), { urls: ["*://*/kcsapi/*"] }, ["responseHeaders"]);

import { onMessage } from './controllers/Message';
chrome.runtime.onMessage.addListener(onMessage.listener());

import { onInstalled } from "./controllers/Runtime";
chrome.runtime.onInstalled.addListener(onInstalled);

import { onClicked } from "./controllers/Notifications";
chrome.notifications.onClicked.addListener(onClicked.listener());

import { onCommand } from "./controllers/Commands";
chrome.commands.onCommand.addListener(onCommand.listener());

// import { Launcher } from "./services/Launcher";
// import { Frame } from "./models/Frame";
// (async () => {
//   const launcher = new Launcher();
//   const frame = await Frame.memory();
//   launcher.launch(frame);
// })();

