import { Logger, LogLevel } from "chromite";
Logger.global.level(LogLevel.DEBUG);

import Alarm from './controllers/Alarm';
chrome.alarms.onAlarm.addListener(Alarm.listener());

// queueを見てるcronを起動
chrome.alarms.create('/cron/queues', { periodInMinutes: 0.5 });
