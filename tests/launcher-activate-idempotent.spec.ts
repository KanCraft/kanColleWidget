import { expect, describe, it, vi, beforeEach } from "vitest";

// Launcher が参照するグローバル chrome を import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} } },
    tabs: { sendMessage: vi.fn() },
    webNavigation: {
      getAllFrames: vi.fn().mockResolvedValue([
        { frameId: 1, url: "https://osapi.dmm.com/gadgets/ifr?game" },
      ]),
    },
  };
});

import { Launcher } from "../src/services/Launcher";
import { WindowService } from "../src/services/WindowService";
import { TabService } from "../src/services/TabService";
import { ScriptingService } from "../src/services/ScriptingService";

const win = { id: 10, tabs: [{ id: 1 }] } as unknown as chrome.windows.Window;
const innerIframe = { frameId: 1 } as unknown as chrome.webNavigation.GetAllFrameResultDetails;

// activate() の check-and-set（scripting.func）の返り値を注入済みフラグとして表現する
function build(funcResults: boolean[]) {
  const scriptings = {
    func: vi.fn(),
    js: vi.fn(),
    css: vi.fn(),
  };
  for (const activated of funcResults) {
    scriptings.func.mockResolvedValueOnce([{ result: activated }]);
  }
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
  });

  it("未注入の document には dmm.js と CSS 一式を注入する", async () => {
    const { launcher, scriptings } = build([false]);

    await launcher.activate(win, innerIframe);

    expect(scriptings.js).toHaveBeenCalledTimes(1);
    expect(scriptings.js).toHaveBeenCalledWith(1, ["dmm.js"]);
    expect(scriptings.css).toHaveBeenCalledWith(1, ["assets/dmm.css"]);
    expect(scriptings.css).toHaveBeenCalledWith({ tabId: 1, frameIds: [1] }, ["assets/osapi.css"]);
  });

  it("同じ document への2回目の activate では何も注入しない（二重注入防止）", async () => {
    const { launcher, scriptings } = build([false, true]);

    await launcher.activate(win, innerIframe);
    await launcher.activate(win, innerIframe);

    // check-and-set は2回走るが、注入は初回の1度だけ
    expect(scriptings.func).toHaveBeenCalledTimes(2);
    expect(scriptings.js).toHaveBeenCalledTimes(1);
    expect(scriptings.css).toHaveBeenCalledTimes(2);
  });

  it("reactivate は内側 iframe を待ってから activate と同じ注入を行う", async () => {
    const { launcher, scriptings } = build([false]);

    await launcher.reactivate(win);

    expect(scriptings.js).toHaveBeenCalledWith(1, ["dmm.js"]);
  });
});
