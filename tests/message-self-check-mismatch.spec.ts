import { expect, describe, it, vi, beforeEach } from "vitest";

// Message.ts の import 連鎖が chrome.runtime / chrome.windows を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
    windows: { get: vi.fn() },
  };
});

const { reactivate } = vi.hoisted(() => ({ reactivate: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../src/services/Launcher", () => ({ Launcher: vi.fn(() => ({ reactivate })) }));

vi.mock("../src/models/Frame", () => ({ Frame: { find: vi.fn(), memory: vi.fn() } }));

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
function dispatch(message: Record<string, unknown>, sender: Partial<chrome.runtime.MessageSender> = {}): Promise<unknown> {
  const listener = onMessage.listener();
  return new Promise((resolve) => {
    listener(message, sender as chrome.runtime.MessageSender, resolve);
  });
}

// /frame/self-check:mismatch（#1848）: dmm.ts の自己診断がズレを検知したとき、
// 次のナビゲーションイベントを待たずにゲーム別窓を再活性化することを検証する。
describe("/frame/self-check:mismatch", () => {
  beforeEach(() => {
    reactivate.mockClear();
    vi.mocked(chrome.windows.get).mockReset();
  });

  it("sender.tab.windowId のウィンドウを再活性化する", async () => {
    const win = { id: 10, tabs: [{ id: 1 }] } as unknown as chrome.windows.Window;
    vi.mocked(chrome.windows.get).mockResolvedValue(win);

    await dispatch(
      { __action__: "/frame/self-check:mismatch" },
      { tab: { windowId: 10 } as chrome.tabs.Tab },
    );

    expect(chrome.windows.get).toHaveBeenCalledWith(10, { populate: true });
    expect(reactivate).toHaveBeenCalledWith(win);
  });

  it("sender.tab が無ければ何もしない", async () => {
    await dispatch({ __action__: "/frame/self-check:mismatch" }, {});

    expect(chrome.windows.get).not.toHaveBeenCalled();
    expect(reactivate).not.toHaveBeenCalled();
  });
});
