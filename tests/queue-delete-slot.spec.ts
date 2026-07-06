import { expect, describe, it, vi, beforeEach } from "vitest";

// jstorm の Model が chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = { runtime: { getURL: (p: string) => p } };
});

import Queue from "../src/models/Queue";
import { EntryType } from "../src/models/entry";

// Queue.deleteSlot が読む entry() の戻り値だけを持つ疑似Queue
const fakeQueue = (type: EntryType, key: "dock" | "deck", slot: string | number) => ({
  type,
  entry: () => ({ [key]: slot }),
  delete: vi.fn().mockResolvedValue(undefined),
});

// 同じスロット（艦隊/ドック）は同時に1件しか進行しないため、Queue.deleteSlot は
// 「同じ種別・同じスロット」の既存Queueだけを削除し、他は一切触らない契約であることを検証する。
describe("Queue.deleteSlot", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("同じ種別・同じドックのQueueだけを削除する", async () => {
    const target = fakeQueue(EntryType.RECOVERY, "dock", "2");
    const otherDock = fakeQueue(EntryType.RECOVERY, "dock", "3");
    const otherType = fakeQueue(EntryType.SHIPBUILD, "dock", "2");
    vi.spyOn(Queue, "list").mockResolvedValue([target, otherDock, otherType] as unknown as Queue[]);

    await Queue.deleteSlot(EntryType.RECOVERY, "2");

    expect(target.delete).toHaveBeenCalledTimes(1);
    expect(otherDock.delete).not.toHaveBeenCalled();
    expect(otherType.delete).not.toHaveBeenCalled();
  });

  it("deck系（遠征・疲労）のスロットも同様に判定できる", async () => {
    const target = fakeQueue(EntryType.MISSION, "deck", "4");
    const other = fakeQueue(EntryType.MISSION, "deck", "1");
    vi.spyOn(Queue, "list").mockResolvedValue([target, other] as unknown as Queue[]);

    await Queue.deleteSlot(EntryType.MISSION, "4");

    expect(target.delete).toHaveBeenCalledTimes(1);
    expect(other.delete).not.toHaveBeenCalled();
  });

  it("保存されている値が数値でも文字列指定と同一スロットとして判定する", async () => {
    const target = fakeQueue(EntryType.SHIPBUILD, "dock", 2);
    vi.spyOn(Queue, "list").mockResolvedValue([target] as unknown as Queue[]);

    await Queue.deleteSlot(EntryType.SHIPBUILD, "2");

    expect(target.delete).toHaveBeenCalledTimes(1);
  });

  it("該当するQueueが無ければ何も削除しない", async () => {
    const other = fakeQueue(EntryType.RECOVERY, "dock", "3");
    vi.spyOn(Queue, "list").mockResolvedValue([other] as unknown as Queue[]);

    await Queue.deleteSlot(EntryType.RECOVERY, "2");

    expect(other.delete).not.toHaveBeenCalled();
  });
});
