import { expect, describe, it, vi, beforeEach } from "vitest";

// Message.ts の import 連鎖が chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
    windows: { get: vi.fn() },
  };
});

const { memory, deleteMock } = vi.hoisted(() => ({
  memory: vi.fn(),
  deleteMock: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("../src/models/Frame", () => ({ Frame: { find: vi.fn(), memory } }));

vi.mock("../src/services/Launcher", () => ({ Launcher: vi.fn(() => ({ reactivate: vi.fn() })) }));

// このルート以外が参照する依存はテスト対象外なので、import 時の副作用を避けるため
// 最小スタブに差し替える（queue-dedupe-on-ocr-result.spec.ts と同じ方針）。
vi.mock("../src/services/ScreenshotService", () => ({ ScreenshotService: vi.fn() }));
vi.mock("../src/services/CropService", () => ({ CropService: vi.fn() }));
vi.mock("../src/models/configs/FileSaveConfig", () => ({ FileSaveConfig: { user: vi.fn() } }));
vi.mock("../src/models/configs/DashboardConfig", () => ({ DashboardConfig: { user: vi.fn() } }));
vi.mock("../src/models/configs/DamageSnapshotConfig", () => ({
  DamageSnapshotConfig: { user: vi.fn() },
  DamageSnapshotMode: { DISABLED: "disabled", INAPP: "inapp", SEPARATE: "separate" },
}));
vi.mock("../src/models/configs/GameWindowConfig", () => ({ GameWindowConfig: { user: vi.fn() } }));
vi.mock("../src/models/Queue", () => ({ default: { deleteSlot: vi.fn(), create: vi.fn() } }));
vi.mock("../src/services/NotificationService", () => ({ NotificationService: { new: () => ({ notify: vi.fn() }) } }));
vi.mock("../src/models/Logbook", () => ({ Logbook: { record: vi.fn(), sortie: {} } }));
vi.mock("../src/models/sortieLabel", () => ({ formatSortieLabel: vi.fn() }));

import { onMessage } from "../src/controllers/Message";

// Router 経由でメッセージを1件処理させ、内部ハンドラの完了(sendResponse呼び出し)を待つ
function dispatch(message: Record<string, unknown>): Promise<unknown> {
  const listener = onMessage.listener();
  return new Promise((resolve) => {
    listener(message, {} as chrome.runtime.MessageSender, resolve);
  });
}

// /frame/memory:reset（#1848）: __memory__ の記憶を削除して既定値へのフォールバックを促す、
// ユーザーが能動的に選んだときだけ動く手動リセット導線を検証する。
describe("/frame/memory:reset", () => {
  beforeEach(() => {
    deleteMock.mockClear();
    memory.mockReset();
    memory.mockResolvedValue({ delete: deleteMock });
  });

  it("__memory__ フレームの記憶を削除する", async () => {
    await dispatch({ __action__: "/frame/memory:reset" });

    expect(memory).toHaveBeenCalledTimes(1);
    expect(deleteMock).toHaveBeenCalledTimes(1);
  });
});
