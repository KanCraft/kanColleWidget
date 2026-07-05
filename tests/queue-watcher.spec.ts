import { expect, describe, it, vi, beforeEach } from "vitest";

// import 連鎖の chromite がモジュール読み込み時に chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} } },
  };
});

const { list, notify } = vi.hoisted(() => ({
  list: vi.fn(),
  notify: vi.fn().mockResolvedValue(""),
}));
vi.mock("../src/models/Queue", () => ({ default: { list } }));
vi.mock("../src/services/NotificationService", () => ({
  NotificationService: vi.fn(() => ({ notify })),
}));

import { Once } from "../src/controllers/Cron/QueueWatcher";

// 期限判定に使う Queue の最小構成
const queue = (scheduled: number) => ({
  scheduled,
  entry: () => ({ type: "mission" }),
  delete: vi.fn().mockResolvedValue(undefined),
});

describe("QueueWatcher.Once", () => {
  beforeEach(() => {
    list.mockReset();
    notify.mockClear();
  });

  it("期限を過ぎた Queue は通知して削除し、期限前の Queue には触らない", async () => {
    const due = queue(Date.now() - 1000);
    const pending = queue(Date.now() + 60 * 1000);
    list.mockResolvedValueOnce([due, pending]);
    await Once();
    expect(notify).toHaveBeenCalledTimes(1);
    expect(due.delete).toHaveBeenCalledTimes(1);
    expect(pending.delete).not.toHaveBeenCalled();
  });

  it("実行は直列化され、前の実行が完了するまで次のチェックは始まらない", async () => {
    let resolveFirst!: (queues: unknown[]) => void;
    list
      .mockReturnValueOnce(new Promise((resolve) => { resolveFirst = resolve; }))
      .mockResolvedValueOnce([]);

    const first = Once();
    const second = Once();

    // 1回目が完了していないうちは、2回目の Queue.list は呼ばれない
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(list).toHaveBeenCalledTimes(1);

    resolveFirst([]);
    await first;
    await second;
    expect(list).toHaveBeenCalledTimes(2);
  });

  it("前の実行が失敗しても次の実行は行われる", async () => {
    list.mockRejectedValueOnce(new Error("storage unavailable"));
    list.mockResolvedValueOnce([]);
    await expect(Once()).rejects.toThrow("storage unavailable");
    await expect(Once()).resolves.toBeUndefined();
    expect(list).toHaveBeenCalledTimes(2);
  });
});
