import { expect, describe, it, vi } from "vitest";

// jstorm の Model が chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = { runtime: { getURL: (p: string) => p } };
});

import Queue from "../src/models/Queue";
import { EntryType, slotKey } from "../src/models/entry";

// EntryType ごとに、スロット番号（艦隊/ドック）を保持する params のキーが
// 規約（修復・建造は dock、それ以外は deck）どおりに決まることを検証する。
describe("slotKey", () => {
  it.each([
    [EntryType.MISSION, "deck"],
    [EntryType.FATIGUE, "deck"],
    [EntryType.RECOVERY, "dock"],
    [EntryType.SHIPBUILD, "dock"],
    [EntryType.UNKNOWN, "deck"],
  ] as const)("%s → %s", (type, expected) => {
    expect(slotKey(type)).toBe(expected);
  });
});

// Queue#slot は type に応じた規約キーで params からスロット値を取り出す。
describe("Queue#slot", () => {
  it("params に規約キーの値があればそれを返す", () => {
    const queue = Queue.new({ type: EntryType.RECOVERY, params: { dock: 3 } });
    expect(queue.slot).toBe(3);
  });

  it("規約キーが無ければ undefined を返す", () => {
    const queue = Queue.new({ type: EntryType.RECOVERY, params: { deck: 2 } });
    expect(queue.slot).toBeUndefined();
  });
});
