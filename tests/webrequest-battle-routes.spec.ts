import { expect, describe, it, vi, beforeEach } from "vitest";

// WebRequest/index.ts の import 連鎖が chrome API を静的参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
    tabs: { sendMessage: vi.fn() },
    storage: { local: { get: () => {}, set: () => {} } },
    notifications: { create: vi.fn(), clear: vi.fn(), getAll: vi.fn() },
    scripting: { executeScript: vi.fn() },
  };
});

const { battleStart, battleMidnight, battleResult, next } = vi.hoisted(() => ({
  battleStart: vi.fn(),
  battleMidnight: vi.fn(),
  battleResult: vi.fn(),
  next: vi.fn(),
}));
vi.mock("../src/models/Logbook", () => ({
  Logbook: {
    sortie: { battle: { start: battleStart, midnight: battleMidnight, result: battleResult }, next },
  },
}));

const { damageSnapshotUser } = vi.hoisted(() => ({ damageSnapshotUser: vi.fn() }));
vi.mock("../src/models/configs/DamageSnapshotConfig", () => ({
  DamageSnapshotConfig: { user: damageSnapshotUser },
}));

import { onBeforeRequest } from "../src/controllers/WebRequest";

const listener = onBeforeRequest.listener() as unknown as (details: unknown) => void;

// listener() は同期的に true を返し、ルーティングとハンドラ呼び出しは内部の Promise で進むため、
// 検証の前にマイクロタスクを流し切る。
const dispatch = async (path: string, formData?: Record<string, string[]>) => {
  listener({
    url: `https://w05o.kancolle-server.com${path}`,
    tabId: 1,
    frameId: 0,
    requestBody: formData ? { formData } : undefined,
  });
  await new Promise((resolve) => setTimeout(resolve, 0));
};

// 連合艦隊の戦闘は艦隊編成と敵の連合有無でパスが分岐する。ハンドラ単体では検出できない
// ルート登録漏れを、実際のディスパッチ経路で固定する（#1864）。
describe("連合艦隊の戦闘 API ルーティング", () => {
  beforeEach(() => {
    battleStart.mockClear();
    battleMidnight.mockClear();
    battleResult.mockClear();
    damageSnapshotUser.mockReset();
    damageSnapshotUser.mockResolvedValue({ keepUntilNextShow: false });
  });

  it.each([
    ["/kcsapi/api_req_combined_battle/battle", "機動部隊"],
    ["/kcsapi/api_req_combined_battle/battle_water", "水上打撃部隊"],
    ["/kcsapi/api_req_combined_battle/each_battle", "機動部隊 vs 敵連合艦隊"],
    ["/kcsapi/api_req_combined_battle/each_battle_water", "水上打撃部隊 vs 敵連合艦隊"],
    ["/kcsapi/api_req_combined_battle/ec_battle", "通常艦隊 vs 敵連合艦隊"],
  ])("%s（%s）は1戦として連戦数に算入される", async (path) => {
    // 連合艦隊の api_formation は警戒航行序列（11〜14）
    await dispatch(path, { api_formation: ["11"] });
    expect(battleStart).toHaveBeenCalledWith("11");
    expect(battleMidnight).not.toHaveBeenCalled();
  });

  it("通常艦隊の戦闘も従来どおり連戦数に算入される", async () => {
    await dispatch("/kcsapi/api_req_sortie/battle", { api_formation: ["1"] });
    expect(battleStart).toHaveBeenCalledWith("1");
  });

  it.each([
    ["/kcsapi/api_req_sortie/battleresult"],
    ["/kcsapi/api_req_combined_battle/battleresult"],
  ])("%s で戦闘終了が記録される", async (path) => {
    await dispatch(path);
    expect(battleResult).toHaveBeenCalledTimes(1);
  });

  // 出撃時の基地航空隊送信であって戦闘ではないため、連戦数に算入しない
  it("api_req_map/start_air_base は戦闘として数えない", async () => {
    await dispatch("/kcsapi/api_req_map/start_air_base");
    expect(battleStart).not.toHaveBeenCalled();
  });
});
