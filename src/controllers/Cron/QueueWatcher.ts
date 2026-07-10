import { Logger } from "../../logger";
import Queue from "../../models/Queue";
import { TriggerType } from "../../models/entry";
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
      const entry = queue.entry();
      notification.notify(entry);
      await queue.delete();
      // 完了通知を出したら、同じ対象の開始通知は役目を終えたので消す
      // （「手動で消すまで残す」設定の開始通知には、他に自動で消える経路がない）。
      notification.clear(entry.$n.id(TriggerType.START));
    } catch (e) {
      log.warn("Once:", e);
    }
  }
}
