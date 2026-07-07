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

export { Mission, Recovery, Shipbuild, Fatigue };
