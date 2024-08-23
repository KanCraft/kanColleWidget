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
export { Mission, Recovery, Shipbuild, Fatigue };
