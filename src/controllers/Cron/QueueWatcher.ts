import { Logger } from "../../logger";
import Queue from "../../models/Queue";
import { NotificationService } from "../../services/NotificationService";

// Once の実行を直列化するための Promise チェーン。
// 多重起動で同一 Queue を並行チェックすると二重通知の恐れがあるため、前回の実行完了を待ってから次を実行する。
let serial: Promise<void> = Promise.resolve();

export function Once(): Promise<void> {
  const result = serial.then(() => check());
  serial = result.catch((e) => Logger.get("QueueWatcher").warn("Once:", e));
  return result;
}

async function check() {
  const log = Logger.get("QueueWatcher");
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
