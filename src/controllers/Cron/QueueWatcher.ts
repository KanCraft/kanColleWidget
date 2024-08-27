import { Logger } from "chromite";
import Queue from "../../models/Queue";

export async function Once() {
  const log = new Logger("QueueWatcher");
  const queues = await Queue.list();
  for (let i = 0; i < queues.length; i++) {
    const queue = queues[i];
    if (queue.scheduled < Date.now()) {
      try {
        const e = queue.entry();
        await chrome.notifications.create(e.$n.id(), e.$n.options())
        await queue.delete();
      } catch (e) {
        log.warn("Once:", e);
      }
    }
  }
}
