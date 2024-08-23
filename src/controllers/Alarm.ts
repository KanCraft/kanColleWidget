import { Router } from "chromite";
import * as QueueWatcher from "./Cron/QueueWatcher";

const r = new Router<chrome.alarms.AlarmEvent>(async (alarm) => ({ __action__: alarm.name }));

r.on("/cron/queues", async (/* alarm */) => {
  QueueWatcher.Once();
});

export default r;

// Debug
QueueWatcher.Once();