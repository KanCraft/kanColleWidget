import { Model } from "jstorm/chrome/local";
import { Entry, EntryType, Fatigue, Mission, Recovery, Shipbuild } from "./entry";
import { MissionSpec } from "../catalog";
import { Logger } from "../logger";
import { H, M, S } from "../utils";

export default class Queue extends Model {
  public static readonly _namespace_ = "Queue";

  // 同じ種別・同じスロット（艦隊/ドック）の既存Queueを削除する。
  // 艦隊もドックも同時に1件しか進行しないため、スロットは常に排他になる
  // （遠征なら同じ艦隊、修復・建造なら同じドックで前のQueueが残っていれば
  // 積み直しの取りこぼしとみなして消す）。
  public static async deleteSlot(type: EntryType, slot: string | number): Promise<void> {
    const queues = await this.list();
    for (const q of queues) {
      if (q.type !== type) continue;
      const entry = q.entry<Mission | Recovery | Shipbuild | Fatigue>() as { dock?: string | number, deck?: string | number };
      if (String(entry.dock ?? entry.deck) === String(slot)) await q.delete();
    }
  }

  public type: EntryType = EntryType.UNKNOWN;
  public params: Record<string, string | number> = {};
  public scheduled: number = 0; // 予定時刻 (Epoch Time) [ms]
  public entry<T extends Entry>(): T {
    switch (this.type) {
    case EntryType.MISSION:
      return new Mission(this.params.deck as never, this.params.id, this.params as unknown as MissionSpec) as unknown as T;
    case EntryType.RECOVERY:
      return new Recovery(this.params.dock as never, this.params.time as never) as unknown as T;
    case EntryType.SHIPBUILD:
      return new Shipbuild(this.params.dock as never, this.params.time as never) as unknown as T;
    case EntryType.FATIGUE:
      return new Fatigue(this.params.deck as never, this.params.seamap as never, this.params.time as never) as unknown as T;
    }
    Logger.get("Queue").warn("Unknown EntryType", this.type, this.params);
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
