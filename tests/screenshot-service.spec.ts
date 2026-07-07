import { expect, describe, it, vi } from "vitest";

import { installMemoryStorage } from "jstorm/testing";

import { ScreenshotService } from "../src/services/ScreenshotService";
import { TempStorage } from "../src/services/TempStorage";
import { FileSaveConfig } from "../src/models/configs/FileSaveConfig";

const URI = "data:image/png;base64,xxxx";

// ScreenshotService.deliver が editBeforeSave 設定に応じて
// 「即ダウンロード」と「編集ページへの受け渡し」を振り分けることを検証する。
describe("ScreenshotService", () => {
  it("editBeforeSave が無効なら即ダウンロードし、編集ページは開かない", async () => {
    const config = await FileSaveConfig.user();
    const downloads = { download: vi.fn(async () => 1) };
    const temp = new TempStorage(installMemoryStorage());
    const openEditPage = vi.fn<(key: string) => Promise<undefined>>();

    await new ScreenshotService(config, downloads, temp, openEditPage).deliver(URI);

    expect(downloads.download).toHaveBeenCalledWith(URI);
    expect(openEditPage).not.toHaveBeenCalled();
  });

  it("editBeforeSave が有効なら TempStorage 経由で編集ページを開き、ダウンロードしない", async () => {
    const config = await FileSaveConfig.user();
    await config.update({ editBeforeSave: true });
    const downloads = { download: vi.fn(async () => 1) };
    const temp = new TempStorage(installMemoryStorage());
    const openEditPage = vi.fn<(key: string) => Promise<undefined>>();

    await new ScreenshotService(config, downloads, temp, openEditPage).deliver(URI);

    expect(openEditPage).toHaveBeenCalledTimes(1);
    expect(downloads.download).not.toHaveBeenCalled();
    // 渡されたキーで、編集ページ側から実際に画像を取り出せる
    const key = openEditPage.mock.calls[0][0];
    expect(await temp.draw(key)).toBe(URI);
  });

  it("take: launcher.capture で撮影した画像を設定のformatで受け取り、deliverへ渡す", async () => {
    // 既定引数省略時に ScreenshotService が内部で DownloadService/TempStorage を
    // 既定構築するため、chrome.downloads / chrome.storage.local の参照先が要る
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).chrome = { downloads: {}, storage: { local: {} } };
    const config = await FileSaveConfig.user();
    const deliverSpy = vi.spyOn(ScreenshotService.prototype, "deliver").mockResolvedValue(undefined);
    const capture = vi.fn<(windowId: number, options: chrome.extensionTypes.ImageDetails) => Promise<string>>()
      .mockResolvedValue(URI);

    await ScreenshotService.take(1, { capture });

    expect(capture).toHaveBeenCalledWith(1, { format: config.format });
    expect(deliverSpy).toHaveBeenCalledWith(URI);
    deliverSpy.mockRestore();
  });
});
