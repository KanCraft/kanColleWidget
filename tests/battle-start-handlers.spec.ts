import { expect, describe, it, vi, beforeEach } from "vitest";

// kcsapi.ts の import 連鎖が chrome.tabs / chrome.runtime を参照するため、import より前にスタブする
const { sendMessage } = vi.hoisted(() => ({ sendMessage: vi.fn() }));
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
    tabs: { sendMessage },
  };
});

const { start, midnight, next } = vi.hoisted(() => ({ start: vi.fn(), midnight: vi.fn(), next: vi.fn() }));
vi.mock("../src/models/Logbook", () => ({ Logbook: { sortie: { battle: { start, midnight }, next } } }));

const { damageSnapshotUser } = vi.hoisted(() => ({ damageSnapshotUser: vi.fn() }));
vi.mock("../src/models/configs/DamageSnapshotConfig", () => ({
  DamageSnapshotConfig: { user: damageSnapshotUser },
}));

import {
  onBattleStarted,
  onCombinedBattleStarted,
  onSpMidnightBattleStarted,
  onAirBattleStarted,
  onMapNext,
} from "../src/controllers/WebRequest/kcsapi";

// ハンドラに渡す webRequest details の最小構成。formData を省略すると requestBody 欠落を表す
const details = (formData?: Record<string, string[]>) =>
  [{
    tabId: 1,
    frameId: 0,
    requestBody: formData ? { formData } : undefined,
  }] as unknown as chrome.webRequest.OnBeforeRequestDetails[];

describe("戦闘開始系ハンドラ", () => {
  beforeEach(() => {
    start.mockClear();
    midnight.mockClear();
    sendMessage.mockClear();
    damageSnapshotUser.mockReset();
    damageSnapshotUser.mockResolvedValue({ keepUntilNextShow: false });
  });

  it("onBattleStarted: 陣形付きでLogbookに戦闘開始を記録する", async () => {
    await onBattleStarted(details({ api_formation: ["1"] }));
    expect(start).toHaveBeenCalledWith("1");
    expect(midnight).not.toHaveBeenCalled();
  });

  it("onSpMidnightBattleStarted: 戦闘開始を記録した後に夜戦フラグを立てる", async () => {
    await onSpMidnightBattleStarted(details({ api_formation: ["2"] }));
    expect(start).toHaveBeenCalledWith("2");
    expect(midnight).toHaveBeenCalledTimes(1);
  });

  it("onCombinedBattleStarted: formData欠落時は空文字でstartを呼び、例外にならない", async () => {
    await expect(onCombinedBattleStarted(details())).resolves.not.toThrow();
    expect(start).toHaveBeenCalledWith("");
  });

  it("keepUntilNextShowが有効なとき、大破進撃防止窓の除去メッセージを送らない", async () => {
    damageSnapshotUser.mockResolvedValue({ keepUntilNextShow: true });
    await onBattleStarted(details({ api_formation: ["1"] }));
    expect(sendMessage).not.toHaveBeenCalled();
  });

  // formation値は kcsapi Recorder で実際に観測した航空戦(1-6)のformDataを反映（#1854）
  it("onAirBattleStarted: 航空戦マスでも通常戦闘と同様にLogbookへ戦闘開始を記録する", async () => {
    await onAirBattleStarted(details({ api_formation: ["3"], api_recovery_type: ["0"] }));
    expect(start).toHaveBeenCalledWith("3");
    expect(midnight).not.toHaveBeenCalled();
  });

  // formation値は kcsapi Recorder で実際に観測した空襲戦(5-2)のformDataを反映（#1854）
  it("onAirBattleStarted: 空襲戦マスでも通常戦闘と同様にLogbookへ戦闘開始を記録する", async () => {
    await onAirBattleStarted(details({ api_formation: ["6"], api_recovery_type: ["0"] }));
    expect(start).toHaveBeenCalledWith("6");
    expect(midnight).not.toHaveBeenCalled();
  });

  it("onAirBattleStarted: formData欠落時は空文字でstartを呼び、例外にならない", async () => {
    await expect(onAirBattleStarted(details())).resolves.not.toThrow();
    expect(start).toHaveBeenCalledWith("");
  });
});

// マップ移動時のマスID記録。api_cell_id はゲーム側の都合で欠落することがあるため、
// 欠落時は Logbook に記録せず警告のみで抜ける契約を検証する。
describe("onMapNext", () => {
  beforeEach(() => {
    next.mockClear();
  });

  it("api_cell_id があれば Logbook にマス移動を記録する", async () => {
    await onMapNext(details({ api_cell_id: ["5"] }));
    expect(next).toHaveBeenCalledWith("5");
  });

  it("api_cell_id が欠落していれば記録しない", async () => {
    await onMapNext(details({ api_recovery_type: ["0"] }));
    expect(next).not.toHaveBeenCalled();
  });

  it("requestBody が欠落していても例外にならない", async () => {
    await expect(onMapNext(details())).resolves.not.toThrow();
    expect(next).not.toHaveBeenCalled();
  });
});
