import { Logger } from "chromite";
import Queue from "../../models/Queue";

export async function Once() {
  const log = new Logger("QueueWatcher");
  const queues = await Queue.list();
  console.log(queues.length, queues);
  for (const queue of queues) {
    if (queue.scheduled > Date.now()) continue;
    try {
      const e = queue.entry();
      await chrome.notifications.create(e.$n.id(), e.$n.options())
      await queue.delete();
    } catch (e) {
      log.warn("Once:", e);
    }
  }
}
