import { expect, describe, it, vi, beforeEach } from "vitest";

// Commands.ts / Message.ts の import 連鎖が chrome.runtime 等を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
    commands: { onCommand: { addListener: () => {} } },
  };
});

const { take } = vi.hoisted(() => ({ take: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../src/services/ScreenshotService", () => ({ ScreenshotService: { take } }));

const { launcherFind, LauncherCtor } = vi.hoisted(() => {
  const launcherFind = vi.fn();
  const LauncherCtor = vi.fn().mockImplementation(() => ({ find: launcherFind }));
  return { launcherFind, LauncherCtor };
});
vi.mock("../src/services/Launcher", () => ({ Launcher: LauncherCtor }));

// Message.ts の他ルートが参照する依存はこのテストの対象外なので、最小スタブに差し替えて
// import 時の副作用（実ストレージ/実サービスへのアクセス）を避ける。
vi.mock("../src/models/Frame", () => ({ Frame: { find: vi.fn(), memory: vi.fn() } }));
vi.mock("../src/models/Queue", () => ({ default: { deleteSlot: vi.fn(), create: vi.fn() } }));
vi.mock("../src/services/CropService", () => ({ CropService: vi.fn() }));
vi.mock("../src/services/TabService", () => ({ TabService: vi.fn() }));
vi.mock("../src/services/NotificationService", () => ({
  NotificationService: { new: () => ({ notify: vi.fn(), clearBy: vi.fn() }) },
}));
vi.mock("../src/models/configs/DashboardConfig", () => ({ DashboardConfig: { user: vi.fn() } }));
vi.mock("../src/models/configs/DamageSnapshotConfig", () => ({
  DamageSnapshotConfig: { user: vi.fn() },
  DamageSnapshotMode: { DISABLED: "disabled", INAPP: "inapp", SEPARATE: "separate" },
}));
vi.mock("../src/models/configs/GameWindowConfig", () => ({ GameWindowConfig: { user: vi.fn() } }));
vi.mock("../src/models/Logbook", () => ({ Logbook: { record: vi.fn(), sortie: { map: null, battles: [] } } }));
vi.mock("../src/models/sortieLabel", () => ({ formatSortieLabel: vi.fn() }));

import { onCommand } from "../src/controllers/Commands";
import { onMessage } from "../src/controllers/Message";
import { Routes } from "../src/messages";

// Router（単発イベント、sendResponse なし）経由でコマンドを発火し、内部処理の完了を待つ。
// 全ての処理がマイクロタスクのみで完結するため、setTimeout(0) のマクロタスクで完了を待てる
// （tests/notification-clear-on-recovery.spec.ts と同じ流儀）。
function dispatchCommand(command: string): Promise<void> {
  const listener = onCommand.listener();
  listener(command);
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// Router 経由でメッセージを1件処理させ、内部ハンドラの完了(sendResponse呼び出し)を待つ
function dispatchMessage(message: Record<string, unknown>, sender: chrome.runtime.MessageSender): Promise<unknown> {
  const listener = onMessage.listener();
  return new Promise((resolve) => {
    listener(message, sender, resolve);
  });
}

// キーボードショートカット「/screenshot」コマンドの入口を検証する（src/controllers/Commands.ts）
describe("/screenshot コマンド(Commands.ts)", () => {
  beforeEach(() => {
    launcherFind.mockReset();
    take.mockClear();
  });

  it("撮影対象のゲーム別窓が見つかったとき、そのウィンドウIDで ScreenshotService.take を呼ぶ", async () => {
    launcherFind.mockResolvedValue({ id: 42 });

    await dispatchCommand("/screenshot");

    expect(take).toHaveBeenCalledWith(42);
  });

  it("撮影対象のゲーム別窓が見つからないとき、例外を投げて ScreenshotService.take を呼ばない", async () => {
    launcherFind.mockResolvedValue(undefined);

    await dispatchCommand("/screenshot");

    expect(take).not.toHaveBeenCalled();
  });
});

// ゲーム別窓内のショートカットキーからの /screenshot メッセージの入口を検証する（src/controllers/Message.ts）
describe(`${Routes.SCREENSHOT} メッセージ(Message.ts)`, () => {
  beforeEach(() => {
    take.mockClear();
  });

  it("送信元タブのウィンドウIDで ScreenshotService.take を呼ぶ", async () => {
    await dispatchMessage(
      { __action__: Routes.SCREENSHOT },
      { tab: { windowId: 7 } } as unknown as chrome.runtime.MessageSender,
    );

    expect(take).toHaveBeenCalledWith(7);
  });

  it("送信元タブ情報が無いとき、ScreenshotService.take を呼ばない", async () => {
    await dispatchMessage({ __action__: Routes.SCREENSHOT }, {} as chrome.runtime.MessageSender);

    expect(take).not.toHaveBeenCalled();
  });
});
