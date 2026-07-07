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

// OCRが時刻を読み損なった場合、scheduled が NaN の Queue（発火せず残り続ける幽霊タイマー）を
// 登録せず、通知も出さないことを検証する。
describe("OCR結果が時刻として解釈できない場合はタイマーを登録しない", () => {
  beforeEach(() => {
    deleteSlot.mockClear();
    create.mockClear();
    notify.mockClear();
  });

  it.each([
    ["区切りの誤認識", "02?35:00"],
    ["空文字", ""],
    ["秒の欠落", "1:23"],
    ["数字以外の混入", "0a:12:34"],
  ])("修復OCR結果が不正(%s: %j): Queueを作らず通知もしない", async (_label, text) => {
    await dispatch({
      __action__: `/injected/dmm/ocr/${EntryType.RECOVERY}:result`,
      data: { text },
      [EntryType.RECOVERY]: { dock: "1" },
    });

    expect(deleteSlot).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("建造OCR結果が不正: Queueを作らず通知もしない", async () => {
    await dispatch({
      __action__: `/injected/dmm/ocr/${EntryType.SHIPBUILD}:result`,
      data: { text: "??:??:??" },
      [EntryType.SHIPBUILD]: { dock: "3" },
    });

    expect(deleteSlot).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });

  it("修復OCR結果が正常: 従来どおりQueueを作成して通知する", async () => {
    await dispatch({
      __action__: `/injected/dmm/ocr/${EntryType.RECOVERY}:result`,
      data: { text: "01:23:45" },
      [EntryType.RECOVERY]: { dock: "1" },
    });

    expect(create).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledTimes(1);
  });
});
