import { Model } from "jstorm/chrome/local";
import { Entry, EntryType, Fatigue, Mission, Recovery, Shipbuild } from "./entry";
import { MissionSpec } from "../catalog";
import { Logger } from "chromite";
import { H, M, S } from "../utils";

export default class Queue extends Model {
  public static readonly _namespace_ = "Queue";  
  public type: EntryType = EntryType.UNKNOWN;
  public params: Record<string, never> = {};
  public scheduled: number = 0; // 予定時刻 (Epoch Time) [ms]
  public entry<T extends Entry>(): T {
    switch (this.type) {
    case EntryType.MISSION:
      return new Mission(this.params.deck, this.params.id, this.params as unknown as MissionSpec) as unknown as T;
    case EntryType.RECOVERY:
      return new Recovery(this.params.dock, this.params.time) as unknown as T;
    case EntryType.SHIPBUILD:
      return new Shipbuild(this.params.dock, this.params.time) as unknown as T;
    case EntryType.FATIGUE:
      return new Fatigue(this.params.deck, this.params.seamap, this.params.time) as unknown as T;
    }
    (new Logger("Queue")).warn("Unknown EntryType", this.type, this.params);
    return {} as T;
  }

  public remain(max: number): { hours: number, minutes: number, seconds: number, progress: number };
  public remain(): { hours: number, minutes: number, seconds: number };
  public remain(max?: number)  {
    const msec = this.scheduled - Date.now();
    return {
      hours: Math.max(0, Math.floor(msec / H)),
      minutes: Math.max(0, Math.floor(msec % H / M)),
      seconds: Math.max(0, Math.floor(msec % M / S)),
      progress: max ? msec / max : undefined,
    }
  }
}