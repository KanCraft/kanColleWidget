import { Logger } from "../logger";
import Queue from "../models/Queue";
import { Frame } from "../models/Frame";
import { SortieContext } from "../models/Logbook";
import { DashboardConfig } from "../models/configs/DashboardConfig";
import { DamageSnapshotConfig } from "../models/configs/DamageSnapshotConfig";
import { FileSaveConfig } from "../models/configs/FileSaveConfig";
import { GameWindowConfig } from "../models/configs/GameWindowConfig";
import { NotificationConfig } from "../models/configs/NotificationConfig";

export async function onInstalled() {
  try {
    await migrateNotificationConfig();
  } catch (e) {
    Logger.get("Runtime").warn("NotificationConfig の移行に失敗:", e);
  }
}

// 正規の保存先として使用中の chrome.storage.local トップレベルキー。移行の対象外。
const KNOWN_NAMESPACES: string[] = [
  Queue._namespace_,
  Frame._namespace_,
  SortieContext._namespace_,
  DashboardConfig._namespace_,
  DamageSnapshotConfig._namespace_,
  FileSaveConfig._namespace_,
  GameWindowConfig._namespace_,
  NotificationConfig._namespace_,
];

// 通知設定テーブルのレコードID形式（/{EntryType または default}/{TriggerType}）
const NOTIFICATION_RECORD_ID_PATTERN = /^\/(default|mission|recovery|shipbuild|fatigue)\/(start|end)$/;

/**
 * _namespace_ 未指定だった過去ビルドの NotificationConfig は、minify で短縮された
 * クラス名が chrome.storage.local のキーになっており、ビルドが変わるとキーも変わって
 * 保存済みの通知設定が読めなくなっていた。そうした短縮名キーに残った通知設定テーブルを
 * 正規キー（NotificationConfig._namespace_）へ移行する。
 *
 * - 短縮名キーはビルドごとに異なり特定できないため、キー名ではなく値の形で判定する:
 *   正規 namespace 以外のトップレベルキーで、値がオブジェクトかつ全レコードIDが
 *   NOTIFICATION_RECORD_ID_PATTERN にマッチするものだけを移行対象とみなす。
 * - 正規キーに既に存在するレコードは正規側を優先し、無いレコードだけ取り込む。
 * - 取り込み後、移行元のキーは削除する。
 * - 少しでも形が合わない場合は何もしない（誤爆防止を最優先とする）。
 */
export async function migrateNotificationConfig(
  area: chrome.storage.StorageArea = chrome.storage.local,
): Promise<void> {
  const all = await area.get(null);
  const strayKeys = Object.keys(all).filter((key) => {
    return !KNOWN_NAMESPACES.includes(key) && isNotificationConfigTable(all[key]);
  });
  if (strayKeys.length === 0) return;

  const canonical = all[NotificationConfig._namespace_] ?? {};
  if (!isPlainObject(canonical)) return;

  const merged: { [id: string]: unknown } = { ...canonical };
  for (const key of strayKeys) {
    for (const [id, record] of Object.entries(all[key] as { [id: string]: unknown })) {
      if (!(id in merged)) merged[id] = record;
    }
  }
  await area.set({ [NotificationConfig._namespace_]: merged });
  await area.remove(strayKeys);
}

function isPlainObject(value: unknown): value is { [key: string]: unknown } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * 値が通知設定テーブル（レコードIDをキーとするオブジェクト）とみなせるかを判定する。
 * 空のテーブルは移行しても意味がないため対象外とする。
 */
function isNotificationConfigTable(value: unknown): boolean {
  if (!isPlainObject(value)) return false;
  const ids = Object.keys(value);
  if (ids.length === 0) return false;
  return ids.every((id) => NOTIFICATION_RECORD_ID_PATTERN.test(id) && isPlainObject(value[id]));
}
