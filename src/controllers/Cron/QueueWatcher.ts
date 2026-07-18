import { Logger } from "../../logger";
import Queue from "../../models/Queue";
import { TriggerType } from "../../models/entry";
import { NotificationService } from "../../services/NotificationService";
import { BadgeService } from "../../services/BadgeService";

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
      await notification.notify(entry);
      await queue.delete();
      // 完了通知を出したら、同じ対象の開始通知は役目を終えたので消す
      // （「手動で消すまで残す」設定の開始通知には、他に自動で消える経路がない）。
      // 他のQueueのcron処理を止めないよう、失敗してもawaitはせずログだけ残す。
      void notification.clear(entry.$n.id(TriggerType.START))
        .catch((e) => log.warn("開始通知の消去に失敗", e));
    } catch (e) {
      log.warn("Once:", e);
    }
  }
  // 完了処理を終えた残りのQueueをバッジ表示に反映する。
  // バッジ更新の失敗が通知処理の結果を壊さないよう、ここで握ってログだけ残す。
  try {
    await new BadgeService().update(queues);
  } catch (e) {
    log.warn("バッジ更新に失敗", e);
  }
}
