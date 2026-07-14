import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";

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
    // find() が所有権レジストリ（GameWindowRegistry）を参照するため、
    // 空のセッションストレージとしてスタブする（#1848）
    storage: {
      session: {
        get: vi.fn().mockResolvedValue({}),
        set: vi.fn().mockResolvedValue(undefined),
        remove: vi.fn().mockResolvedValue(undefined),
      },
    },
  };
});

import { Launcher } from "../src/services/Launcher";
import { Frame } from "../src/models/Frame";
import { WindowService } from "../src/services/WindowService";
import { TabService } from "../src/services/TabService";
import { ScriptingService } from "../src/services/ScriptingService";
import { GameWindowRegistry } from "../src/services/GameWindowRegistry";
import { KanColleURL } from "../src/constants";
import { installMemoryStorage } from "jstorm/testing";

// find() が既存ゲーム窓を見つけられる状態のフェイク群を組み立てる。
// existingTabs を空にすると「ゲーム窓なし」を表現できる。
// registry を渡さない場合は既定（グローバルにスタブした空の chrome.storage.session）を使う。
function build(existingTabs: chrome.tabs.Tab[], registry?: GameWindowRegistry) {
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
  // func() は実際の ScriptingService.func() と同様に常に Promise を返す
  // （activate() は失敗時にこの戻り値へ .catch() を連鎖するため）
  const scriptings = { func: vi.fn().mockResolvedValue([{ result: false }]), js: vi.fn(), css: vi.fn() };
  const launcher = new Launcher(
    windows as unknown as WindowService,
    tabs as unknown as TabService,
    scriptings as unknown as ScriptingService,
    registry,
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

describe("Launcher.find の所有権判定（#1848）", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registry に生きている windowId の記録があれば、URL一致ヒューリスティックより優先して返す", async () => {
    const registry = new GameWindowRegistry(installMemoryStorage());
    await registry.remember(55);
    const { launcher, windows, tabs } = build([], registry);
    windows.get.mockResolvedValue({ id: 55, tabs: [{ id: 7 }] });

    const win = await launcher.find();

    expect(win?.id).toBe(55);
    // ヒューリスティック検索（URL一致でのtabs.query）は呼ばれない
    expect(tabs.query).not.toHaveBeenCalled();
  });

  it("記録された窓が既に閉じられていれば、記録を掃除してヒューリスティックへフォールバックする", async () => {
    const registry = new GameWindowRegistry(installMemoryStorage());
    await registry.remember(999); // 実体の無い windowId
    const { launcher, windows, tabs } = build(existingGameTab, registry);
    windows.get.mockImplementation((id: number) =>
      id === 999
        ? Promise.reject(new Error("No window with id: 999."))
        : Promise.resolve({ id: 10, tabs: [{ id: 1 }] })
    );

    const win = await launcher.find();

    expect(win?.id).toBe(10);
    expect(tabs.query).toHaveBeenCalled();
    expect(await registry.current()).toBeUndefined(); // 死んだ記録は掃除される
  });

  it("記録が無ければ従来どおりヒューリスティックで探す", async () => {
    const registry = new GameWindowRegistry(installMemoryStorage());
    const { launcher, tabs } = build(existingGameTab, registry);

    const win = await launcher.find();

    expect(win?.id).toBe(10);
    expect(tabs.query).toHaveBeenCalled();
  });
});

describe("Launcher.open の注入リトライ（#1848）", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("activate() の初回注入が失敗しても、500ms後にリトライして最終的に成功する", async () => {
    vi.useFakeTimers();
    const { launcher, scriptings } = build([]);
    scriptings.js.mockRejectedValueOnce(new Error("transient failure")).mockResolvedValue(undefined);

    const promise = launcher.launch(new Frame());
    await vi.advanceTimersByTimeAsync(500);
    const created = await promise;

    expect(created).toBe(true);
    expect(scriptings.js).toHaveBeenCalledTimes(2);
  });

  it("最大2回リトライしても失敗し続ければ、最後のエラーを投げる", async () => {
    vi.useFakeTimers();
    const { launcher, scriptings } = build([]);
    scriptings.js.mockRejectedValue(new Error("permanent failure"));

    const rejection = expect(launcher.launch(new Frame())).rejects.toThrow("permanent failure");
    await vi.advanceTimersByTimeAsync(500);
    await vi.advanceTimersByTimeAsync(500);
    await rejection;

    // 初回 + リトライ2回 = 3回試行する
    expect(scriptings.js).toHaveBeenCalledTimes(3);
  });
});
