import { Router } from "chromite";
import * as QueueWatcher from "./Cron/QueueWatcher";

const r = new Router<typeof chrome.alarms.onAlarm>(async (alarm) => ({ __action__: alarm.name }));

r.on("/cron/queues", async (/* alarm */) => {
  QueueWatcher.Once();
});

setTimeout(() => QueueWatcher.Once(), 10);

export default r;

