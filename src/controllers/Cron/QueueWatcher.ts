import { Logger } from "chromite";
import Queue from "../../models/Queue";
import { NotificationService } from "../../services/NotificationService";

export async function Once() {
  const log = new Logger("QueueWatcher");
  const queues = await Queue.list();
  const notification = new NotificationService();
  for (const queue of queues) {
    if (queue.scheduled > Date.now()) continue;
    try {
      notification.notify(queue.entry());
      await queue.delete();
    } catch (e) {
      log.warn("Once:", e);
    }
  }
}
