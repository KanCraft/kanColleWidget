import { expect, describe, it, vi, beforeEach } from "vitest";

// chromite はモジュール読み込み時に chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} } },
    notifications: { clear: vi.fn() },
  };
});

// Launcher をモックし、通知クリックがどのメソッドを呼ぶかだけを検証する（#1810）。
const { focusOrLaunch, launch } = vi.hoisted(() => ({
  focusOrLaunch: vi.fn(),
  launch: vi.fn(),
}));
vi.mock("../src/services/Launcher", () => ({
  Launcher: vi.fn(() => ({ focusOrLaunch, launch })),
}));
vi.mock("../src/models/Frame", () => ({
  Frame: { memory: vi.fn().mockResolvedValue({ url: "https://example.test" }) },
}));

import { onClicked } from "../src/controllers/Notifications";

const fire = (id: string) => {
  const listener = onClicked.listener();
  // chromite の listener は同期的に呼び出され、ハンドラは Promise 内で実行される
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener as any)(id);
};

describe("Notifications onClicked（#1810）", () => {
  beforeEach(() => {
    focusOrLaunch.mockReset();
    launch.mockReset();
    (chrome.notifications.clear as ReturnType<typeof vi.fn>).mockReset();
  });

  it("通知クリックは focusOrLaunch でアクティブ化し、launch（retouch）は呼ばない", async () => {
    focusOrLaunch.mockResolvedValue(false);
    fire("/mission/2/end");
    await vi.waitFor(() => expect(focusOrLaunch).toHaveBeenCalledTimes(1));
    expect(launch).not.toHaveBeenCalled();
  });

  it("処理後に通知をクリアする", async () => {
    focusOrLaunch.mockResolvedValue(false);
    fire("/recovery/1/end");
    await vi.waitFor(() => expect(chrome.notifications.clear).toHaveBeenCalledWith("/recovery/1/end"));
  });
});
