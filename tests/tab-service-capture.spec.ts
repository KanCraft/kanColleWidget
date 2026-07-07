import { describe, expect, it, vi } from "vitest";

import { TabService } from "../src/services/TabService";

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
