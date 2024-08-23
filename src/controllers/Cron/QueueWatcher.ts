// import { Logger } from "chromite";
import Queue from "../../models/Queue";

export async function Once() {
  // const log = new Logger("QueueWatcher");
  const queues = await Queue.list();
  for (let i = 0; i < queues.length; i++) {
    const queue = queues[i];
    if (queue.scheduled < Date.now()) {
      const e = queue.entry();
      await chrome.notifications.create(e.toNotificationID(), e.toNotificationOptions())
      await queue.delete();
    }
  }
}
