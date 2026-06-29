import { expect, describe, it, vi, beforeEach } from "vitest";

// Launcher のメソッドは chrome.tabs.sendMessage / chrome.webNavigation などを参照するため、
// import より前にグローバル chrome をスタブする。
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} } },
    tabs: { sendMessage: vi.fn() },
    // open() 内の waitForInnerIframeLoaded が内側 iframe を即座に見つけられるようにする
    webNavigation: {
      getAllFrames: vi.fn().mockResolvedValue([
        { frameId: 1, url: "https://osapi.dmm.com/gadgets/ifr?game" },
      ]),
    },
  };
});

import { Launcher } from "../src/services/Launcher";
import { Frame } from "../src/models/Frame";
import { WindowService } from "../src/services/WindowService";
import { TabService } from "../src/services/TabService";
import { ScriptingService } from "../src/services/ScriptingService";
import { KanColleURL } from "../src/constants";

// find() が既存ゲーム窓を見つけられる状態のフェイク群を組み立てる。
// existingTabs を空にすると「ゲーム窓なし」を表現できる。
function build(existingTabs: chrome.tabs.Tab[]) {
  const windows = {
    create: vi.fn().mockResolvedValue({ id: 20, tabs: [{ id: 2 }] }),
    update: vi.fn().mockResolvedValue({}),
    remove: vi.fn(),
    get: vi.fn().mockResolvedValue({ id: 10, tabs: [{ id: 1 }] }),
  };
  const tabs = {
    query: vi.fn().mockResolvedValue(existingTabs),
    update: vi.fn().mockResolvedValue({}),
  };
  const scriptings = { func: vi.fn(), js: vi.fn(), css: vi.fn() };
  const launcher = new Launcher(
    windows as unknown as WindowService,
    tabs as unknown as TabService,
    scriptings as unknown as ScriptingService,
  );
  return { launcher, windows, tabs, scriptings };
}

const existingGameTab = [
  { url: KanColleURL, windowId: 10 },
] as unknown as chrome.tabs.Tab[];

describe("Launcher.focusOrLaunch（#1810）", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("既存窓があるときは focus のみで、サイズ調整（resize）を行わない", async () => {
    const { launcher, windows } = build(existingGameTab);

    const created = await launcher.focusOrLaunch(new Frame());

    expect(created).toBe(false);
    // windows.update は focus 用の1回だけ。サイズ指定では呼ばれない。
    expect(windows.update).toHaveBeenCalledTimes(1);
    expect(windows.update).toHaveBeenCalledWith(10, { focused: true });
    expect(windows.create).not.toHaveBeenCalled();
    // retouch 経由のサイズ調整メッセージも飛ばない
    expect(chrome.tabs.sendMessage).not.toHaveBeenCalled();
  });

  it("既存窓が無いときは新規作成する", async () => {
    const { launcher, windows } = build([]);

    const created = await launcher.focusOrLaunch(new Frame());

    expect(created).toBe(true);
    expect(windows.create).toHaveBeenCalledTimes(1);
  });
});

describe("Launcher.launch（既存窓では従来通り retouch する）", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("既存窓があるときはサイズ調整（resize）と focus を行う", async () => {
    const { launcher, windows } = build(existingGameTab);

    const created = await launcher.launch(new Frame());

    expect(created).toBe(false);
    // サイズ指定の update と focus の update の2回呼ばれる
    expect(windows.update).toHaveBeenCalledWith(10, expect.objectContaining({ width: expect.any(Number), height: expect.any(Number) }));
    expect(windows.update).toHaveBeenCalledWith(10, { focused: true });
    // retouch のサイズ調整メッセージが飛ぶ
    expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, { __action__: "/injected/dmm/retouch" });
  });
});
