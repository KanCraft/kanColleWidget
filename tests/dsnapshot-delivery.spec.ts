import { expect, describe, it, vi, beforeEach } from "vitest";

// Message.ts / WebRequest 系の import 連鎖が chrome.runtime 等を参照するため、import より前にスタブする
const { sendMessage, removeWindow } = vi.hoisted(() => {
  const sendMessage = vi.fn();
  const removeWindow = vi.fn();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
    notifications: { getAll: vi.fn(), clear: vi.fn() },
    tabs: { sendMessage },
    windows: { remove: removeWindow },
  };
  return { sendMessage, removeWindow };
});

const { capture } = vi.hoisted(() => ({ capture: vi.fn().mockResolvedValue("data:image/jpeg;base64,raw") }));
vi.mock("../src/services/TabService", () => ({
  TabService: vi.fn().mockImplementation(() => ({ capture })),
}));

const { crop } = vi.hoisted(() => ({ crop: vi.fn().mockResolvedValue("cropped-uri") }));
vi.mock("../src/services/CropService", () => ({
  CropService: vi.fn().mockImplementation(() => ({ crop })),
}));

const { getDsnapshotTab, damagesnapshot } = vi.hoisted(() => ({
  getDsnapshotTab: vi.fn(),
  damagesnapshot: vi.fn(),
}));
vi.mock("../src/services/Launcher", () => ({
  Launcher: Object.assign(
    vi.fn().mockImplementation(() => ({ getDsnapshotTab })),
    { damagesnapshot },
  ),
}));

const { dsnapshotUser } = vi.hoisted(() => ({ dsnapshotUser: vi.fn() }));
vi.mock("../src/models/configs/DamageSnapshotConfig", () => ({
  DamageSnapshotConfig: { user: dsnapshotUser },
  DamageSnapshotMode: { DISABLED: "disabled", INAPP: "inapp", SEPARATE: "separate" },
}));

const { formatSortieLabel } = vi.hoisted(() => ({ formatSortieLabel: vi.fn() }));
vi.mock("../src/models/sortieLabel", () => ({ formatSortieLabel }));

vi.mock("../src/models/Logbook", () => ({
  Logbook: { record: vi.fn().mockResolvedValue(null), sortie: { map: null, battles: [] } },
}));

vi.mock("../src/utils", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  sleep: vi.fn().mockResolvedValue(undefined),
  WorkerImage: { from: vi.fn().mockResolvedValue({ bitmap: {} }) },
}));

// Message.ts の他ルートが参照する依存はこのテストの対象外なので、最小スタブに差し替える
vi.mock("../src/models/Frame", () => ({ Frame: { find: vi.fn(), memory: vi.fn() } }));
vi.mock("../src/models/Queue", () => ({ default: { deleteSlot: vi.fn(), create: vi.fn() } }));
vi.mock("../src/services/ScreenshotService", () => ({ ScreenshotService: vi.fn() }));
vi.mock("../src/models/configs/DashboardConfig", () => ({ DashboardConfig: { user: vi.fn() } }));
vi.mock("../src/models/configs/GameWindowConfig", () => ({ GameWindowConfig: { user: vi.fn() } }));
vi.mock("../src/services/NotificationService", () => ({
  NotificationService: { new: () => ({ notify: vi.fn(), clearBy: vi.fn() }) },
}));

import { onMessage } from "../src/controllers/Message";
import { onComplete } from "../src/controllers/WebRequest";
import { onPort } from "../src/controllers/WebRequest/kcsapi";
import { Routes } from "../src/messages";

// Router 経由でメッセージを1件処理させ、内部ハンドラの完了(sendResponse呼び出し)を待つ
// (tests/queue-dedupe-on-ocr-result.spec.ts と同じ流儀)
function dispatchMessage(message: Record<string, unknown>, sender: chrome.runtime.MessageSender): Promise<unknown> {
  const listener = onMessage.listener();
  return new Promise((resolve) => {
    listener(message, sender, resolve);
  });
}

// SequentialRouter(onComplete) 経由でイベントを1件流し、ハンドラの完了を待つ
// (tests/notification-clear-on-recovery.spec.ts と同じ流儀)
const completeListener = onComplete.listener();
async function fireComplete(path: string, tabId: number, frameId: number) {
  completeListener({ url: `https://w00g.kancolle-server.com${path}`, tabId, frameId } as unknown as chrome.webRequest.OnCompletedDetails);
  await new Promise((resolve) => setTimeout(resolve, 0));
}

// 大破進撃防止スナップショットの撮影〜配送フロー（/damage-snapshot/capture）を検証する。
// TabService.capture で撮影し、設定モードに応じてゲーム別窓内 or 別窓へ表示メッセージを送る。
describe("/damage-snapshot/capture の配送(Message.ts)", () => {
  beforeEach(() => {
    capture.mockClear();
    crop.mockClear();
    sendMessage.mockClear();
    damagesnapshot.mockClear();
    formatSortieLabel.mockReset();
    dsnapshotUser.mockReset();
  });

  it("INAPPモード: TabService.captureで撮影し、送信元タブへDSNAPSHOT_SHOWを送る", async () => {
    dsnapshotUser.mockResolvedValue({ mode: "inapp", heightRatio: 55, areaLabelFormat: "number" });
    formatSortieLabel.mockReturnValue("1-1 (2)");

    await dispatchMessage(
      { __action__: Routes.DAMAGE_SNAPSHOT_CAPTURE, after: 0, timestamp: 12345 },
      { tab: { windowId: 9, id: 5 } } as unknown as chrome.runtime.MessageSender,
    );

    expect(capture).toHaveBeenCalledWith(9, { format: "jpeg" });
    expect(sendMessage).toHaveBeenCalledWith(5, {
      __action__: Routes.DSNAPSHOT_SHOW,
      uri: "cropped-uri",
      timestamp: 12345,
      heightRatio: 55,
      label: "1-1 (2)",
    });
  });

  it("SEPARATEモード: 別窓のダメージスナップショットタブへDSNAPSHOT_SEPARATE_PUSHを送る", async () => {
    dsnapshotUser.mockResolvedValue({ mode: "separate", heightRatio: 40, areaLabelFormat: "number" });
    formatSortieLabel.mockReturnValue("2-3 (1)");
    damagesnapshot.mockResolvedValue({ tabs: [{ id: 77 }] });

    await dispatchMessage(
      { __action__: Routes.DAMAGE_SNAPSHOT_CAPTURE, after: 0, timestamp: 999 },
      { tab: { windowId: 9, id: 5 } } as unknown as chrome.runtime.MessageSender,
    );

    expect(sendMessage).toHaveBeenCalledWith(77, {
      __action__: Routes.DSNAPSHOT_SEPARATE_PUSH,
      uri: "cropped-uri",
      timestamp: 999,
      label: "2-3 (1)",
    });
  });
});

// 戦闘結果を回収しようとしたとき（api_req_sortie/battleresult 系）、大破進撃防止窓を表示する
// 準備としてDSNAPSHOT_PREPAREを送ることを検証する。単艦隊と連合艦隊で count が変わる（#1764）。
describe("戦闘結果回収時のDSNAPSHOT_PREPARE送信(WebRequest/index.ts)", () => {
  beforeEach(() => {
    sendMessage.mockClear();
  });

  it("通常艦隊のbattleresult: count:1でDSNAPSHOT_PREPAREを送る", async () => {
    await fireComplete("/kcsapi/api_req_sortie/battleresult", 11, 3);

    expect(sendMessage).toHaveBeenCalledWith(
      11,
      expect.objectContaining({ __action__: Routes.DSNAPSHOT_PREPARE, count: 1 }),
      { frameId: 3 },
    );
  });

  it("連合艦隊のbattleresult: count:2でDSNAPSHOT_PREPAREを送る", async () => {
    await fireComplete("/kcsapi/api_req_combined_battle/battleresult", 12, 4);

    expect(sendMessage).toHaveBeenCalledWith(
      12,
      expect.objectContaining({ __action__: Routes.DSNAPSHOT_PREPARE, count: 2 }),
      { frameId: 4 },
    );
  });
});

// 母港帰投時（api_port/port）、開いたままの大破進撃防止別窓を閉じることを検証する。
describe("母港帰投時のダメージスナップショット別窓クローズ(kcsapi.ts onPort)", () => {
  const details = [{ tabId: 1, frameId: 0 }] as unknown as chrome.webRequest.OnBeforeRequestDetails[];

  beforeEach(() => {
    removeWindow.mockClear();
    getDsnapshotTab.mockReset();
  });

  it("別窓が開いているとき、そのwindowIdでchrome.windows.removeする", async () => {
    getDsnapshotTab.mockResolvedValue({ windowId: 33 });

    await onPort(details);

    expect(removeWindow).toHaveBeenCalledWith(33);
  });

  it("別窓が無いとき、chrome.windows.removeを呼ばない", async () => {
    getDsnapshotTab.mockResolvedValue(undefined);

    await onPort(details);

    expect(removeWindow).not.toHaveBeenCalled();
  });
});
