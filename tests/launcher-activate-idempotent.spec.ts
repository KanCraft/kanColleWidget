import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";

// Launcher が参照するグローバル chrome を import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} } },
    tabs: { sendMessage: vi.fn() },
    webNavigation: { getAllFrames: vi.fn() },
  };
});

import { Launcher } from "../src/services/Launcher";
import { WindowService } from "../src/services/WindowService";
import { TabService } from "../src/services/TabService";
import { ScriptingService } from "../src/services/ScriptingService";

const win = { id: 10, tabs: [{ id: 1 }] } as unknown as chrome.windows.Window;
const innerIframe = { frameId: 1 } as unknown as chrome.webNavigation.GetAllFrameResultDetails;
const osapiFrame = { frameId: 1, url: "https://osapi.dmm.com/gadgets/ifr?game" };

// scripting.func に渡されたコールバックを jsdom の window 上で実際に実行するスタブ。
// これにより check-and-set（__kancolleWidgetActivated の読み書き）の実挙動を検証できる。
function build() {
  const scriptings = {
    func: vi.fn(async (_target: unknown, fn: (...args: unknown[]) => unknown, args?: unknown[]) => [
      { result: args ? fn(...args) : fn() },
    ]),
    js: vi.fn().mockResolvedValue(undefined),
    css: vi.fn().mockResolvedValue(undefined),
  };
  const launcher = new Launcher(
    {} as unknown as WindowService,
    {} as unknown as TabService,
    scriptings as unknown as ScriptingService,
  );
  return { launcher, scriptings };
}

describe("Launcher.activate の冪等性（#1813 / #1845）", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(chrome.webNavigation.getAllFrames).mockResolvedValue([osapiFrame]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).__kancolleWidgetActivated;
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("未注入の document には dmm.js と CSS 一式を注入する", async () => {
    const { launcher, scriptings } = build();

    await launcher.activate(win, innerIframe);

    expect(scriptings.js).toHaveBeenCalledTimes(1);
    expect(scriptings.js).toHaveBeenCalledWith(1, ["dmm.js"]);
    expect(scriptings.css).toHaveBeenCalledWith(1, ["assets/dmm.css"]);
    expect(scriptings.css).toHaveBeenCalledWith({ tabId: 1, frameIds: [1] }, ["assets/osapi.css"]);
  });

  it("同じ document への2回目の activate では何も注入しない（二重注入防止）", async () => {
    const { launcher, scriptings } = build();

    await launcher.activate(win, innerIframe);
    await launcher.activate(win, innerIframe);

    // check-and-set は2回走るが、注入は初回の1度だけ
    expect(scriptings.func).toHaveBeenCalledTimes(2);
    expect(scriptings.js).toHaveBeenCalledTimes(1);
    expect(scriptings.css).toHaveBeenCalledTimes(2);
  });

  it("注入に失敗したらフラグを戻し、次回の activate で再試行できる", async () => {
    const { launcher, scriptings } = build();
    scriptings.js.mockRejectedValueOnce(new Error("injection failed"));

    await expect(launcher.activate(win, innerIframe)).rejects.toThrow("injection failed");
    // フラグが戻っているので、次の activate は短絡せず再注入する
    await launcher.activate(win, innerIframe);

    expect(scriptings.js).toHaveBeenCalledTimes(2);
  });

  it("reactivate は内側 iframe を待ってから activate と同じ注入を行う", async () => {
    const { launcher, scriptings } = build();

    await launcher.reactivate(win);

    expect(scriptings.js).toHaveBeenCalledWith(1, ["dmm.js"]);
  });

  it("内側 iframe が現れない場合はタイムアウトで reject し、ポーリングも止まる", async () => {
    vi.useFakeTimers();
    vi.mocked(chrome.webNavigation.getAllFrames).mockResolvedValue([]);
    const { launcher, scriptings } = build();

    const rejection = expect(launcher.reactivate(win)).rejects.toThrow("Timeout");
    await vi.advanceTimersByTimeAsync(30 * 1000);
    await rejection;
    expect(scriptings.js).not.toHaveBeenCalled();

    // reject 後はポーリングが止まっている（決着後も回り続ける旧バグの再発防止）
    const polled = vi.mocked(chrome.webNavigation.getAllFrames).mock.calls.length;
    await vi.advanceTimersByTimeAsync(5 * 1000);
    expect(vi.mocked(chrome.webNavigation.getAllFrames).mock.calls.length).toBe(polled);
  });
});
