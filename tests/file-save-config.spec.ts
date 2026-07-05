import { expect, describe, it } from "vitest";

import { Model } from "jstorm/chrome/local";
import { installMemoryStorage } from "jstorm/testing";

import { FileSaveConfig } from "../src/models/configs/FileSaveConfig";

// スクショ保存設定（FileSaveConfig）の既定値と、拡張子込みテンプレート
// （format 導入以前の旧形式）から拡張子なしテンプレート + format への移行を検証する。
describe("FileSaveConfig", () => {
  it("既定はテンプレート拡張子なし + format png で、getFilename が .png を付ける", async () => {
    const config = await FileSaveConfig.user();
    expect(config.filenameTemplate).toBe("%Y%m%d_%H%M%S");
    expect(config.format).toBe("png");
    expect(config.editBeforeSave).toBe(false);
    expect(config.getFilename(new Date(2024, 5, 15, 13, 45, 1))).toBe("20240615_134501.png");
  });

  it.each([
    ["%Y%m%d_%H%M%S.png", "%Y%m%d_%H%M%S", "png"],
    ["kancolle_%H%M%S.jpg", "kancolle_%H%M%S", "jpeg"],
    ["kancolle_%H%M%S.jpeg", "kancolle_%H%M%S", "jpeg"],
  ])("旧形式テンプレート %s を拡張子なしテンプレート + format=%s に移行して保存し直す", async (legacy, template, format) => {
    const area = installMemoryStorage({
      "FileSaveConfig": {
        "user": { _id: "user", askAlways: false, folder: "艦これ", filenameTemplate: legacy },
      },
    });
    Model.useStorage(area);

    const config = await FileSaveConfig.user();

    expect(config.filenameTemplate).toBe(template);
    expect(config.format).toBe(format);
    // 移行結果が storage にも永続化されている
    const all = await area.get(null);
    expect(all["FileSaveConfig"]["user"]).toMatchObject({ filenameTemplate: template, format });
  });

  it("拡張子なしテンプレートは移行対象外で、設定済みの format を上書きしない", async () => {
    const area = installMemoryStorage({
      "FileSaveConfig": {
        "user": { _id: "user", askAlways: false, folder: "艦これ", filenameTemplate: "%Y%m%d_%H%M%S", format: "jpeg" },
      },
    });
    Model.useStorage(area);

    const config = await FileSaveConfig.user();

    expect(config.filenameTemplate).toBe("%Y%m%d_%H%M%S");
    expect(config.format).toBe("jpeg");
    expect(config.getFilename(new Date(2024, 5, 15, 13, 45, 1))).toBe("20240615_134501.jpeg");
  });
});
