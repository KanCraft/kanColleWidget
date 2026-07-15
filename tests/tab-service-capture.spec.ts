import { describe, expect, it, vi } from "vitest";

import { TabService } from "../src/services/TabService";
import { Launcher } from "../src/services/Launcher";
import type { WindowService } from "../src/services/WindowService";
import type { ScriptingService } from "../src/services/ScriptingService";

// TabService.capture がネイティブ Promise 形式の chrome.tabs.captureVisibleTab の
// 成功/失敗をそのまま resolve/reject として伝播することを検証する
describe("TabService.capture", () => {
  it("成功時: captureVisibleTab が resolve した dataURL をそのまま返す", async () => {
    const dataUrl = "data:image/jpeg;base64,stub";
    const mod = { captureVisibleTab: vi.fn().mockResolvedValue(dataUrl) } as unknown as typeof chrome.tabs;
    const tabs = new TabService(mod);

    await expect(tabs.capture(1, { format: "jpeg" })).resolves.toBe(dataUrl);
    expect(mod.captureVisibleTab).toHaveBeenCalledWith(1, { format: "jpeg" });
  });

  it("失敗時: captureVisibleTab の reject をそのまま伝播する", async () => {
    const error = new Error("キャプチャに失敗しました");
    const mod = { captureVisibleTab: vi.fn().mockRejectedValue(error) } as unknown as typeof chrome.tabs;
    const tabs = new TabService(mod);

    await expect(tabs.capture(1, { format: "jpeg" })).rejects.toThrow(error);
  });
});

// TabService.query がネイティブ Promise 形式の chrome.tabs.query にそのまま委譲することを検証する
describe("TabService.query", () => {
  it("queryInfo をそのまま渡し、query が resolve した結果をそのまま返す", async () => {
    const tabsResult = [{ id: 1 }] as unknown as chrome.tabs.Tab[];
    const mod = { query: vi.fn().mockResolvedValue(tabsResult) } as unknown as typeof chrome.tabs;
    const tabs = new TabService(mod);

    await expect(tabs.query({ windowType: "popup" })).resolves.toBe(tabsResult);
    expect(mod.query).toHaveBeenCalledWith({ windowType: "popup" });
  });
});

// Launcher.capture が既定オプション({format:"jpeg", quality:100})で TabService.capture に
// 委譲することを検証する（#1826 でタブ単位からウィンドウ単位のキャプチャへ変更）
describe("Launcher.capture", () => {
  it("options 省略時: {format: jpeg, quality: 100} で TabService.capture に委譲する", async () => {
    const dataUrl = "data:image/jpeg;base64,stub";
    const tabs = { capture: vi.fn().mockResolvedValue(dataUrl) } as unknown as TabService;
    const launcher = new Launcher({} as unknown as WindowService, tabs, {} as unknown as ScriptingService);

    await expect(launcher.capture(1)).resolves.toBe(dataUrl);
    expect(tabs.capture).toHaveBeenCalledWith(1, { format: "jpeg", quality: 100 });
  });

  it("options 指定時: そのオプションをそのまま TabService.capture に渡す", async () => {
    const dataUrl = "data:image/png;base64,stub";
    const tabs = { capture: vi.fn().mockResolvedValue(dataUrl) } as unknown as TabService;
    const launcher = new Launcher({} as unknown as WindowService, tabs, {} as unknown as ScriptingService);

    await expect(launcher.capture(2, { format: "png" })).resolves.toBe(dataUrl);
    expect(tabs.capture).toHaveBeenCalledWith(2, { format: "png" });
  });
});
