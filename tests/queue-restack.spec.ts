import { expect, describe, it, vi, beforeEach } from "vitest";

// jstorm の Model が chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = { runtime: { getURL: (p: string) => p } };
});

import Queue from "../src/models/Queue";
import { EntryType } from "../src/models/entry";

// Queue.restack は「削除→作成」の定型を1箇所に集約したもの。逆順だと作成した
// Queue ごと削除されてしまうため、順序保証がこのメソッドの契約の中心になる。
describe("Queue.restack", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("deleteSlot を (type, slot) で呼ぶ", async () => {
    const deleteSlot = vi.spyOn(Queue, "deleteSlot").mockResolvedValue(undefined);
    vi.spyOn(Queue, "create").mockResolvedValue(Queue.new({ type: EntryType.RECOVERY }));

    await Queue.restack(EntryType.RECOVERY, "2", { dock: "2" }, 12345);

    expect(deleteSlot).toHaveBeenCalledWith(EntryType.RECOVERY, "2");
  });

  it("create を { type, params, scheduled } で呼ぶ", async () => {
    vi.spyOn(Queue, "deleteSlot").mockResolvedValue(undefined);
    const create = vi.spyOn(Queue, "create").mockResolvedValue(Queue.new({ type: EntryType.RECOVERY }));
    const params = { dock: "2" };

    await Queue.restack(EntryType.RECOVERY, "2", params, 12345);

    expect(create).toHaveBeenCalledWith({ type: EntryType.RECOVERY, params, scheduled: 12345 });
  });

  it("削除は作成より先に行う（逆順だと作成したQueueごと消えるため）", async () => {
    const deleteSlot = vi.spyOn(Queue, "deleteSlot").mockResolvedValue(undefined);
    const create = vi.spyOn(Queue, "create").mockResolvedValue(Queue.new({ type: EntryType.RECOVERY }));

    await Queue.restack(EntryType.RECOVERY, "2", { dock: "2" }, 12345);

    const deleteOrder = deleteSlot.mock.invocationCallOrder[0];
    const createOrder = create.mock.invocationCallOrder[0];
    expect(deleteOrder).toBeLessThan(createOrder);
  });

  it("create の戻り値をそのまま返す", async () => {
    vi.spyOn(Queue, "deleteSlot").mockResolvedValue(undefined);
    const created = Queue.new({ type: EntryType.RECOVERY });
    vi.spyOn(Queue, "create").mockResolvedValue(created);

    const result = await Queue.restack(EntryType.RECOVERY, "2", { dock: "2" }, 12345);

    expect(result).toBe(created);
  });
});
