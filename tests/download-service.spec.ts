import { expect, describe, it, vi, beforeEach } from "vitest";

import { Model } from "jstorm/chrome/local";
import { installMemoryStorage } from "jstorm/testing";

// static saveCanvasAsImage は mod を注入できず既定の chrome.downloads を使うため、
// グローバルスタブを用意しておく。
const { downloadMock } = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const downloadMock = vi.fn(async (_options: unknown) => 1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    downloads: { download: downloadMock },
  };
  return { downloadMock };
});

import { DownloadService } from "../src/services/DownloadService";
import { FileSaveConfig } from "../src/models/configs/FileSaveConfig";

beforeEach(() => {
  downloadMock.mockClear();
});

describe("DownloadService", () => {
  // インスタンス download が config 由来の filename（folder + getFilename）と
  // saveAs（askAlways）を chrome.downloads.download に渡すことを検証する
  it("インスタンス download は folder/getFilename 由来の filename と config.askAlways 由来の saveAs を渡す", async () => {
    const area = installMemoryStorage({
      "FileSaveConfig": {
        "user": { _id: "user", askAlways: true, folder: "myfolder", filenameTemplate: "%Y%m%d_%H%M%S", format: "png" },
      },
    });
    Model.useStorage(area);
    const config = await FileSaveConfig.user();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mod = { download: vi.fn(async (_options: chrome.downloads.DownloadOptions) => 42) };

    const id = await new DownloadService(config, mod).download("data:image/png;base64,xx");

    expect(id).toBe(42);
    expect(mod.download).toHaveBeenCalledTimes(1);
    const [options] = mod.download.mock.calls[0];
    expect(options.url).toBe("data:image/png;base64,xx");
    expect(options.filename).toMatch(/^myfolder\/\d{8}_\d{6}\.png$/);
    expect(options.saveAs).toBe(true);
  });

  // static direct が指定された url/filename をそのまま渡し、saveAs を false に固定することを検証する
  it("static direct は渡された url/filename をそのまま渡し saveAs を false に固定する", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mod = { download: vi.fn(async (_options: chrome.downloads.DownloadOptions) => 7) };

    const id = await DownloadService.direct("data:text/csv;base64,yy", "logbook.csv", mod);

    expect(id).toBe(7);
    expect(mod.download).toHaveBeenCalledWith({
      url: "data:text/csv;base64,yy",
      filename: "logbook.csv",
      saveAs: false,
    });
  });

  // static saveCanvasAsImage が toDataURL に渡す MIME と、getFilename が付ける拡張子を
  // config.format で一致させていることを検証する
  it("static saveCanvasAsImage は config.format に応じた MIME で toDataURL を呼び、拡張子が一致するファイル名で保存する", async () => {
    const area = installMemoryStorage({
      "FileSaveConfig": {
        "user": { _id: "user", askAlways: false, folder: "艦これ", filenameTemplate: "%Y%m%d_%H%M%S", format: "jpeg" },
      },
    });
    Model.useStorage(area);
    const toDataURL = vi.fn(() => "data:image/jpeg;base64,x");
    const canvas = { toDataURL } as unknown as HTMLCanvasElement;

    await DownloadService.saveCanvasAsImage(canvas);

    expect(toDataURL).toHaveBeenCalledWith("image/jpeg");
    expect(downloadMock).toHaveBeenCalledTimes(1);
    const [options] = downloadMock.mock.calls[0] as [chrome.downloads.DownloadOptions];
    expect(options.url).toBe("data:image/jpeg;base64,x");
    expect(options.filename).toMatch(/\.jpeg$/);
  });
});
