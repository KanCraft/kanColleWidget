import { expect, describe, it, vi, beforeEach } from "vitest";

// Message.ts の import 連鎖が chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
  };
});

const { deleteSlot, create } = vi.hoisted(() => ({
  deleteSlot: vi.fn().mockResolvedValue(undefined),
  create: vi.fn().mockResolvedValue({ entry: () => ({}) }),
}));
vi.mock("../src/models/Queue", () => ({ default: { deleteSlot, create } }));

const { notify } = vi.hoisted(() => ({ notify: vi.fn().mockResolvedValue("") }));
vi.mock("../src/services/NotificationService", () => ({
  NotificationService: { new: () => ({ notify }) },
}));

// 修復・建造以外のルート（frame/open-or-focus, screenshot 等）が参照する依存はこのテストの
// 対象外なので、モジュール丸ごと最小スタブに差し替えて import 時の副作用を避ける。
vi.mock("../src/models/Frame", () => ({ Frame: { find: vi.fn(), memory: vi.fn() } }));
vi.mock("../src/services/Launcher", () => ({ Launcher: vi.fn() }));
vi.mock("../src/services/ScreenshotService", () => ({ ScreenshotService: vi.fn() }));
vi.mock("../src/services/CropService", () => ({ CropService: vi.fn() }));
vi.mock("../src/models/configs/FileSaveConfig", () => ({ FileSaveConfig: { user: vi.fn() } }));
vi.mock("../src/models/configs/DashboardConfig", () => ({ DashboardConfig: { user: vi.fn() } }));
vi.mock("../src/models/configs/DamageSnapshotConfig", () => ({
  DamageSnapshotConfig: { user: vi.fn() },
  DamageSnapshotMode: { DISABLED: "disabled", INAPP: "inapp", SEPARATE: "separate" },
}));
vi.mock("../src/models/configs/GameWindowConfig", () => ({ GameWindowConfig: { user: vi.fn() } }));
vi.mock("../src/models/Logbook", () => ({ Logbook: { record: vi.fn(), sortie: {} } }));
vi.mock("../src/models/sortieLabel", () => ({ formatSortieLabel: vi.fn() }));

import { onMessage } from "../src/controllers/Message";
import { EntryType } from "../src/models/entry";

// Router 経由でメッセージを1件処理させ、内部ハンドラの完了(sendResponse呼び出し)を待つ
function dispatch(message: Record<string, unknown>): Promise<unknown> {
  const listener = onMessage.listener();
  return new Promise((resolve) => {
    listener(message, {}, resolve);
  });
}

// 入渠・建造のOCR結果受信時、同じドックの既存Queueを削除してから新規作成する保険が
// 効いていることを検証する（#1826 系のドック重複バグの回帰防止）。
describe("入渠・建造OCR結果受信時のQueue重複排除(保険)", () => {
  beforeEach(() => {
    deleteSlot.mockClear();
    create.mockClear();
  });

  it("修復OCR結果: 同じドックの既存Queueを削除してから新規作成する", async () => {
    await dispatch({
      __action__: `/injected/dmm/ocr/${EntryType.RECOVERY}:result`,
      data: { text: "01:23:45" },
      [EntryType.RECOVERY]: { dock: "2" },
    });

    expect(deleteSlot).toHaveBeenCalledWith(EntryType.RECOVERY, "2");
    expect(create).toHaveBeenCalledTimes(1);
    const deleteOrder = deleteSlot.mock.invocationCallOrder[0];
    const createOrder = create.mock.invocationCallOrder[0];
    expect(deleteOrder).toBeLessThan(createOrder);
  });

  it("建造OCR結果: 同じドックの既存Queueを削除してから新規作成する", async () => {
    await dispatch({
      __action__: `/injected/dmm/ocr/${EntryType.SHIPBUILD}:result`,
      data: { text: "00:30:00" },
      [EntryType.SHIPBUILD]: { dock: "1" },
    });

    expect(deleteSlot).toHaveBeenCalledWith(EntryType.SHIPBUILD, "1");
    expect(create).toHaveBeenCalledTimes(1);
    const deleteOrder = deleteSlot.mock.invocationCallOrder[0];
    const createOrder = create.mock.invocationCallOrder[0];
    expect(deleteOrder).toBeLessThan(createOrder);
  });
});
