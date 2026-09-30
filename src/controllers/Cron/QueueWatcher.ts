import { Logger } from "../../logger";
import Queue from "../../models/Queue";
import { EntryType, Mission, TriggerType } from "../../models/entry";
import { BehaviorConfig } from "../../models/configs/BehaviorConfig";
import { M } from "../../utils";
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
  const minutes = (await BehaviorConfig.user()).normalizedMissionRemindMinutes();
  for (const queue of queues) {
    // 出撃を跨いだ支援遠征は、本隊が帰投するまで支援艦隊も帰投しない。帰投予定時刻を過ぎても
    // 完了通知は出さず、残り時間の目安としてタイマーを残す（本隊の母港帰投で畳まれる）。
    // 帰投時刻が読めないので、予告も出さない。
    if (queue.sortied) continue;
    if (queue.scheduled > Date.now()) {
      await remind(queue, minutes, notification).catch((e) => log.warn("予告に失敗", e));
      continue;
    }
    try {
      const entry = queue.entry();
      await notification.notify(entry);
      await queue.delete();
      // 完了通知を出したら、同じ対象の開始通知は役目を終えたので消す
      // （「手動で消すまで残す」設定の開始通知には、他に自動で消える経路がない）。
      // 他のQueueのcron処理を止めないよう、失敗してもawaitはせずログだけ残す。
      void notification.clear(entry.$n.id(TriggerType.START))
        .catch((e) => log.warn("開始通知の消去に失敗", e));
      // 同じく、表示中の帰投予告も役目を終えたので消す（#935）
      if (queue.type === EntryType.MISSION) {
        void notification.clear(entry.$n.id(TriggerType.REMIND))
          .catch((e) => log.warn("予告通知の消去に失敗", e));
      }
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

// 遠征の完了通知の minutes 分前を過ぎていて、まだ予告していなければ帰投予告を出す（#935）。
// 予告を出せたときだけ印を付ける。予告が無効なら印を付けないので、途中で有効にしても
// 完了前であれば予告が出る。
async function remind(queue: Queue, minutes: number, notification: NotificationService) {
  if (queue.type !== EntryType.MISSION || queue.reminded) return;
  if (!queue.inRemindWindow(minutes * M)) return;
  const entry = queue.entry<Mission>();
  const id = entry.$n.id(TriggerType.REMIND);
  const notified = await notification.notifyRaw(id, id, (config) => entry.$n.remind(minutes, config));
  if (notified) await queue.update({ reminded: true });
}
