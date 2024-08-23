import { Model } from "jstorm/chrome/local";
import { Entry, EntryType, Mission } from "./entry";
import { MissionSpec } from "../catalog";


export default class Queue extends Model {
  public static readonly _namespace_ = "Queue";  
  public type: EntryType = EntryType.UNKNOWN;
  public params: Record<string, never> = {};
  public scheduled: number = 0; // 予定時刻 (Epoch Time) [ms]
  public entry<T extends Entry>(): T {
    switch (this.type) {
    case EntryType.MISSION:
      return new Mission(this.params.deck, this.params.id, this.params as unknown as MissionSpec) as unknown as T;
    }
    return {} as T;
  }
}