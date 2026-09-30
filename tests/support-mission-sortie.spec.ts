import { expect, describe, it, vi, beforeEach } from "vitest";

// kcsapi.ts の import 連鎖が chrome.runtime 等を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
    notifications: { getAll: vi.fn(), clear: vi.fn() },
    tabs: { sendMessage: vi.fn() },
    windows: { remove: vi.fn() },
  };
});

const { list, deleteSlot, create, restack } = vi.hoisted(() => ({
  list: vi.fn().mockResolvedValue([]),
  deleteSlot: vi.fn().mockResolvedValue(undefined),
  create: vi.fn().mockResolvedValue({ entry: () => ({}) }),
  restack: vi.fn().mockResolvedValue({ entry: () => ({}) }),
}));
vi.mock("../src/models/Queue", () => ({ default: { list, deleteSlot, create, restack } }));

const { notify, clear, clearBy } = vi.hoisted(() => ({
  notify: vi.fn().mockResolvedValue(""),
  clear: vi.fn().mockResolvedValue(true),
  clearBy: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("../src/services/NotificationService", () => ({
  NotificationService: { new: () => ({ notify, clear, clearBy }) },
}));

const { getDsnapshotTab } = vi.hoisted(() => ({ getDsnapshotTab: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../src/services/Launcher", () => ({
  Launcher: vi.fn().mockImplementation(function () { return { getDsnapshotTab }; }),
}));

vi.mock("../src/models/Logbook", () => ({
  Logbook: { record: vi.fn().mockResolvedValue(null), sortie: { start: vi.fn() } },
}));

const { behaviorUser } = vi.hoisted(() => ({
  behaviorUser: vi.fn().mockResolvedValue({ restackFatigueOnSortie: false }),
}));
vi.mock("../src/models/configs/BehaviorConfig", () => ({ BehaviorConfig: { user: behaviorUser } }));

import { onMapStart, onPort } from "../src/controllers/WebRequest/kcsapi";
import { isSupportMission } from "../src/catalog";
import { EntryType } from "../src/models/entry";

// ハンドラに渡す webRequest details の最小構成
const details = (formData: Record<string, string[]>) =>
  [{ requestBody: { formData } }] as unknown as chrome.webRequest.OnBeforeRequestDetails[];
const mapStartDetails = () => details({ api_deck_id: ["1"], api_maparea_id: ["1"], api_mapinfo_no: ["1"] });
const portDetails = [{ tabId: 1, frameId: 0 }] as unknown as chrome.webRequest.OnBeforeRequestDetails[];

// Queue.list() が返すQueueの最小構成。出撃の記録は update 経由で書かれるためスパイにする
const queue = (props: { type: EntryType, id?: number, slot?: string, sortied?: boolean }) => ({
  type: props.type,
  params: props.id === undefined ? {} : { id: props.id },
  slot: props.slot,
  sortied: props.sortied ?? false,
  update: vi.fn().mockResolvedValue(undefined),
});

// 支援艦隊は本隊が帰投するまで戦域に留まり、本隊とともに帰投する。そのため出撃を跨いだ支援遠征は
// 出撃中もタイマーを残したまま完了通知を出さず、本隊の母港帰投で黙って畳む（#1857）。
// 出撃中に完了通知を出さない挙動は tests/queue-watcher.spec.ts で検証する。
describe("出撃開始時の支援遠征Queueへの記録(onMapStart)", () => {
  beforeEach(() => {
    list.mockReset();
    behaviorUser.mockResolvedValue({ restackFatigueOnSortie: false });
  });

  it("進行中の支援遠征のQueueに出撃したことを記録する", async () => {
    const support = queue({ type: EntryType.MISSION, id: 34, slot: "2" }); // 決戦支援任務(南方)
    list.mockResolvedValue([support]);

    await onMapStart(mapStartDetails());

    expect(support.update).toHaveBeenCalledWith({ sortied: true });
  });

  // 出撃を跨ぐと帰投時刻が読めなくなるため、表示中の帰投予告（#935）も消す
  it("出撃した支援遠征の艦隊の帰投予告通知を消す", async () => {
    const support = queue({ type: EntryType.MISSION, id: 34, slot: "2" });
    list.mockResolvedValue([support]);

    await onMapStart(mapStartDetails());

    expect(clear).toHaveBeenCalledWith("/mission/remind/2");
  });

  it("複数の支援艦隊を出していれば、そのすべてに記録する", async () => {
    const escort = queue({ type: EntryType.MISSION, id: 301, slot: "3" }); // 前衛支援任務(イベント海域)
    const decisive = queue({ type: EntryType.MISSION, id: 302, slot: "4" }); // 決戦支援任務(イベント海域)
    list.mockResolvedValue([escort, decisive]);

    await onMapStart(mapStartDetails());

    expect(escort.update).toHaveBeenCalledWith({ sortied: true });
    expect(decisive.update).toHaveBeenCalledWith({ sortied: true });
  });

  it("支援以外の遠征のQueueには記録しない（出撃と関係なく進行するため）", async () => {
    const normal = queue({ type: EntryType.MISSION, id: 2, slot: "3" }); // 対潜警戒任務
    list.mockResolvedValue([normal]);

    await onMapStart(mapStartDetails());

    expect(normal.update).not.toHaveBeenCalled();
  });

  it("遠征以外のQueueには記録しない", async () => {
    const fatigue = queue({ type: EntryType.FATIGUE, slot: "1" });
    const recovery = queue({ type: EntryType.RECOVERY, slot: "1" });
    list.mockResolvedValue([fatigue, recovery]);

    await onMapStart(mapStartDetails());

    expect(fatigue.update).not.toHaveBeenCalled();
    expect(recovery.update).not.toHaveBeenCalled();
  });
});

describe("母港帰投時の支援遠征タイマーの終了(onPort)", () => {
  beforeEach(() => {
    list.mockReset();
    deleteSlot.mockClear();
    clearBy.mockClear();
    notify.mockClear();
  });

  it("出撃を跨いだQueueを、完了通知を出さずに削除する", async () => {
    list.mockResolvedValue([queue({ type: EntryType.MISSION, id: 34, slot: "2", sortied: true })]);

    await onPort(portDetails);

    expect(deleteSlot).toHaveBeenCalledWith(EntryType.MISSION, "2");
    expect(notify).not.toHaveBeenCalled();
  });

  // 開始通知は「手動で消すまで残す」設定があり、Queueを消すだけでは残り続けるため通知も畳む。
  // 「一致するものだけ消し他を残す」具体挙動は NotificationService.clearBy の単体テストで担保する。
  it("出撃を跨いだQueueの艦隊の通知を clearBy で消す", async () => {
    list.mockResolvedValue([queue({ type: EntryType.MISSION, id: 34, slot: "2", sortied: true })]);

    await onPort(portDetails);

    expect(clearBy).toHaveBeenCalledWith({ type: EntryType.MISSION, target: "2" });
  });

  it("出撃を跨いでいないQueueは残す（支援に出しただけで出撃していない艦隊）", async () => {
    list.mockResolvedValue([queue({ type: EntryType.MISSION, id: 34, slot: "2" })]);

    await onPort(portDetails);

    expect(deleteSlot).not.toHaveBeenCalled();
    expect(clearBy).not.toHaveBeenCalled();
  });
});

describe("isSupportMission", () => {
  it.each([
    ["33", true], // 前衛支援任務(南方)
    ["34", true], // 決戦支援任務(南方)
    ["197", true], // 前衛支援任務(イベント)
    ["198", true], // 決戦支援任務(イベント)
    ["301", true], // 前衛支援任務(イベント海域)
    ["302", true], // 決戦支援任務(イベント海域)
    ["15", false], // 囮機動部隊支援作戦（支援艦隊ではない通常の遠征）
    ["16", false], // 艦隊決戦援護作戦（同上）
    ["2", false], // 対潜警戒任務
    ["9999", false], // カタログ未収録
  ])("遠征ID %s の判定は %s", (id, expected) => {
    expect(isSupportMission(id)).toBe(expected);
  });
});
