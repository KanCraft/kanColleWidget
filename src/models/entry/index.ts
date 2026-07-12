import { Mission } from "./Mission";
import { Recovery } from "./Recovery";
import { Shipbuild } from "./Shipbuild";
import { Fatigue } from "./Fatigue";

export type Entry = Mission | Recovery | Shipbuild | Fatigue;
export enum EntryType {
    MISSION = "mission",
    RECOVERY = "recovery",
    SHIPBUILD = "shipbuild",
    FATIGUE = "fatigue",
    UNKNOWN = "unknown",
    TEST_DEFAULT = "default",
}

// EntryType ごとに、スロット番号（艦隊/ドック）を保持する params のキーを返す。
// 修復・建造はドック(dock)、それ以外（遠征・疲労）は艦隊(deck)を使う。
export function slotKey(type: EntryType): "dock" | "deck" {
  return type === EntryType.RECOVERY || type === EntryType.SHIPBUILD ? "dock" : "deck";
}

export enum TriggerType {
  START = "start",
  END = "end",
  UNKNOWN = "unknown",
}

// タイマーQueueのEntryを持つ種別。通知設定レコードの直積生成にも使う。
export const TIMER_ENTRY_TYPES = [
  EntryType.MISSION,
  EntryType.RECOVERY,
  EntryType.SHIPBUILD,
  EntryType.FATIGUE,
] as const;

export { Mission, Recovery, Shipbuild, Fatigue };
export { NotificationId } from "./NotificationId";
export type { ParsedNotificationId } from "./NotificationId";
