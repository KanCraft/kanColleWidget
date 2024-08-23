import { Router } from "chromite";
import * as QueueWatcher from "./Cron/QueueWatcher";

const r = new Router<chrome.alarms.AlarmEvent>(async (alarm) => ({ __action__: alarm.name }));

r.on("/cron/queues", async (/* alarm */) => {
  QueueWatcher.Once();
});

setTimeout(() => QueueWatcher.Once(), 10);

export default r;

