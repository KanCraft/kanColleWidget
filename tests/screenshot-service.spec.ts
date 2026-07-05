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
});
