import { Router } from "chromite";
import * as QueueWatcher from "./Cron/QueueWatcher";
import { BehaviorConfig } from "../models/configs/BehaviorConfig";
import { sleep } from "../utils";

const r = new Router<typeof chrome.alarms.onAlarm>(async (alarm) => ({ __action__: alarm.name }));

// chrome.alarms の周期は下限が30秒のため、それより短い監視間隔は
// アラーム発火で起きた Service Worker の生存中に、間隔ごとに複数回チェックすることで実現する。
// 例: 監視間隔10秒なら、0秒・10秒・20秒後の3回チェックし、残りは次のアラーム発火が引き継ぐ。
r.on("/cron/queues", async (/* alarm */) => {
  const config = await BehaviorConfig.user();
  const interval = config.normalizedQueueWatchIntervalSeconds();
  for (let elapsed = 0; elapsed < BehaviorConfig.ALARM_PERIOD_SECONDS; elapsed += interval) {
    if (elapsed > 0) await sleep(interval * 1000);
    await QueueWatcher.Once();
  }
});

setTimeout(() => QueueWatcher.Once(), 10);

export default r;
