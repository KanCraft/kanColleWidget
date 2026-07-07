import { expect, describe, it, vi, beforeEach } from "vitest";

// kcsapi.ts の import 連鎖が chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
    notifications: { getAll: vi.fn(), clear: vi.fn() },
  };
});

const { deleteSlot, create, restack } = vi.hoisted(() => ({
  deleteSlot: vi.fn().mockResolvedValue(undefined),
  create: vi.fn().mockResolvedValue({ entry: () => ({}) }),
  restack: vi.fn().mockResolvedValue({ entry: () => ({}) }),
}));
vi.mock("../src/models/Queue", () => ({ default: { deleteSlot, create, restack } }));

const { notify, clear, getAll } = vi.hoisted(() => ({
  notify: vi.fn().mockResolvedValue(""),
  clear: vi.fn().mockResolvedValue(true),
  getAll: vi.fn().mockResolvedValue({}),
}));
vi.mock("../src/services/NotificationService", () => ({
  NotificationService: { new: () => ({ notify, clear, getAll }) },
}));

vi.mock("../src/models/Logbook", () => ({ Logbook: { sortie: { start: vi.fn() } } }));

const { behaviorUser } = vi.hoisted(() => ({ behaviorUser: vi.fn() }));
vi.mock("../src/models/configs/BehaviorConfig", () => ({ BehaviorConfig: { user: behaviorUser } }));

vi.mock("../src/catalog", () => ({
  missions: { "999": { title: "テスト遠征", category: "test", time: 3_600_000 } },
}));

import { onRecoveryHighspeed, onShipbuildHighspeed, onMissionStart, onMapStart } from "../src/controllers/WebRequest/kcsapi";

// ハンドラに渡す webRequest details の最小構成
const details = (formData: Record<string, string[]>) =>
  [{ requestBody: { formData } }] as unknown as chrome.webRequest.OnBeforeRequestDetails[];

describe("修復・建造の高速化剤使用(speedchange)検知", () => {
  beforeEach(() => {
    deleteSlot.mockClear();
    clear.mockClear();
    getAll.mockClear();
  });

  it("onRecoveryHighspeed: 対象ドックの修復Queueを削除する", async () => {
    await onRecoveryHighspeed(details({ api_ndock_id: ["2"] }));
    expect(deleteSlot).toHaveBeenCalledWith("recovery", "2");
    expect(deleteSlot).toHaveBeenCalledTimes(1);
  });

  // speedchange 経路では完了通知が出ない（QueueWatcherを通らない）ため、
  // 表示中の修復通知（開始・完了）の掃除もこのハンドラが担う
  it("onRecoveryHighspeed: 対象ドックの表示中の修復通知を消し、他は消さない", async () => {
    getAll.mockResolvedValueOnce({
      "/recovery/start/2": true,
      "/recovery/end/2": true,
      "/recovery/start/1": true,
      "/mission/end/2": true,
    });
    await onRecoveryHighspeed(details({ api_ndock_id: ["2"] }));
    expect(clear.mock.calls.map(([id]) => id).sort()).toEqual(["/recovery/end/2", "/recovery/start/2"]);
  });

  it("onShipbuildHighspeed: 対象ドックの建造Queueを削除する", async () => {
    await onShipbuildHighspeed(details({ api_kdock_id: ["3"] }));
    expect(deleteSlot).toHaveBeenCalledWith("shipbuild", "3");
    expect(deleteSlot).toHaveBeenCalledTimes(1);
  });
});

describe("遠征開始時の重複排除", () => {
  beforeEach(() => {
    restack.mockClear();
  });

  // 削除→作成の順序保証はモデル層(Queue.restack)の契約になったため、ここでは
  // コントローラが正しい type/slot で restack を呼ぶことだけを検証する（tests/queue-restack.spec.ts参照）。
  it("onMissionStart: 同じ艦隊の既存Queueを削除してから積み直す", async () => {
    await onMissionStart(details({ api_deck_id: ["4"], api_mission_id: ["999"], api_mission: ["93"] }));
    expect(restack).toHaveBeenCalledWith("mission", "4", expect.anything(), expect.any(Number));
  });

  it("onMissionStart: requestBodyが欠落していても例外を投げず、restackを呼ばない", async () => {
    await expect(onMissionStart([{ requestBody: undefined }] as unknown as chrome.webRequest.OnBeforeRequestDetails[])).resolves.not.toThrow();
    expect(restack).not.toHaveBeenCalled();
  });
});

describe("カタログ未収録の遠征ID", () => {
  beforeEach(() => {
    deleteSlot.mockClear();
    create.mockClear();
    restack.mockClear();
    notify.mockClear();
  });

  it("onMissionStart: 所要時間が不明なためタイマーを積まず通知もしない", async () => {
    await onMissionStart(details({ api_deck_id: ["2"], api_mission_id: ["123"], api_mission: ["93"] }));
    expect(deleteSlot).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(restack).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });
});

describe("疲労Queueの積み直し設定(restackFatigueOnSortie)", () => {
  beforeEach(() => {
    create.mockClear();
    restack.mockClear();
    behaviorUser.mockReset();
  });

  const mapStartDetails = () => details({ api_deck_id: ["1"], api_maparea_id: ["1"], api_mapinfo_no: ["1"] });

  it("設定が有効なら同じ艦隊の既存の疲労Queueを削除して積み直す", async () => {
    behaviorUser.mockResolvedValue({ restackFatigueOnSortie: true });
    await onMapStart(mapStartDetails());
    expect(restack).toHaveBeenCalledWith("fatigue", 1, expect.anything(), expect.any(Number));
  });

  it("設定が無効なら既存の疲労Queueを削除しない（出撃ごとに積み上がる仕様）", async () => {
    behaviorUser.mockResolvedValue({ restackFatigueOnSortie: false });
    await onMapStart(mapStartDetails());
    expect(restack).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledTimes(1);
  });
});
