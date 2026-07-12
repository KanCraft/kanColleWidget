import { expect, describe, it, vi, beforeEach } from "vitest";

// chromite はモジュール読み込み時に chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = { runtime: { id: "test", onMessage: { addListener: () => {} } } };
});

// Launcher をモックして、ルーティング判定と所有権チェックのみを検証する
const { find, reactivate } = vi.hoisted(() => ({
  find: vi.fn(),
  reactivate: vi.fn(),
}));
vi.mock("../src/services/Launcher", () => ({
  Launcher: vi.fn(() => ({ find, reactivate })),
}));

import { onCommitted } from "../src/controllers/WebNavigation";

const KanColleURL = "https://play.games.dmm.com/game/kancolle";

// webNavigation.onCommitted に渡される details の最小構成
const details = (over: Record<string, unknown> = {}) => ({
  tabId: 1,
  url: KanColleURL,
  frameId: 0,
  transitionType: "reload",
  transitionQualifiers: [],
  timeStamp: 0,
  processId: 0,
  ...over,
});

const fire = (over?: Record<string, unknown>) => {
  const listener = onCommitted.listener();
  // chromite の listener は同期的に true を返し、ハンドラは Promise 内で実行される
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener as any)(details(over));
};

describe("WebNavigation onCommitted", () => {
  beforeEach(() => {
    find.mockReset();
    reactivate.mockReset();
  });

  it("ゲーム画面のリロード時、自分の窓なら再活性化する", async () => {
    find.mockResolvedValue({ id: 10, tabs: [{ id: 1 }] });
    fire();
    await vi.waitFor(() => expect(reactivate).toHaveBeenCalledTimes(1));
  });

  it("リロード以外のナビゲーションでも自分の窓なら再活性化する（#1845: ブラウザ主導の再読み込みでは transitionType が reload にならないことがある）", async () => {
    find.mockResolvedValue({ id: 10, tabs: [{ id: 1 }] });
    fire({ transitionType: "link" });
    await vi.waitFor(() => expect(reactivate).toHaveBeenCalledTimes(1));
  });

  it("ゲーム画面以外の URL では何もしない", async () => {
    find.mockResolvedValue({ id: 10, tabs: [{ id: 1 }] });
    fire({ url: "https://example.com/" });
    // ルーティング対象外なので find すら呼ばれない
    await new Promise((r) => setTimeout(r, 10));
    expect(find).not.toHaveBeenCalled();
    expect(reactivate).not.toHaveBeenCalled();
  });

  it("トップフレーム以外（frameId != 0）のリロードでは何もしない", async () => {
    find.mockResolvedValue({ id: 10, tabs: [{ id: 1 }] });
    fire({ frameId: 5 });
    await new Promise((r) => setTimeout(r, 10));
    expect(find).not.toHaveBeenCalled();
    expect(reactivate).not.toHaveBeenCalled();
  });

  it("自分が開いた窓が見つからない場合は再活性化しない", async () => {
    find.mockResolvedValue(undefined);
    fire();
    await new Promise((r) => setTimeout(r, 10));
    expect(reactivate).not.toHaveBeenCalled();
  });

  it("リロードされたタブが自分の窓のタブと一致しない場合は再活性化しない", async () => {
    // 自分の popup は tabId=99 だが、リロードされたのは tabId=1（別タブ）
    find.mockResolvedValue({ id: 10, tabs: [{ id: 99 }] });
    fire({ tabId: 1 });
    await new Promise((r) => setTimeout(r, 10));
    expect(reactivate).not.toHaveBeenCalled();
  });

  it("reactivate の失敗（iframe 待ちタイムアウト等）は警告ログを出して握りつぶす", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    find.mockResolvedValue({ id: 10, tabs: [{ id: 1 }] });
    reactivate.mockRejectedValue(new Error("Timeout waiting for inner iframe loaded"));
    fire();
    await vi.waitFor(() => expect(warn).toHaveBeenCalled());
    warn.mockRestore();
  });
});
