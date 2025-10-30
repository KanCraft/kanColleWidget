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
}

export const EntryColor = {
  [EntryType.MISSION]: "sky",
  [EntryType.RECOVERY]: "teal",
  [EntryType.SHIPBUILD]: "orange",
  [EntryType.FATIGUE]: "red",
  [EntryType.UNKNOWN]: "gray",
}

export { Mission, Recovery, Shipbuild, Fatigue };
