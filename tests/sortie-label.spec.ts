import { expect, describe, it } from "vitest";

import { formatSortieLabel } from "../src/models/sortieLabel";

describe("formatSortieLabel", () => {
  it("番号形式で『area-info (連戦数)』を返す", () => {
    expect(formatSortieLabel({ area: "1", info: "1" }, 1, "number")).toBe("1-1 (1)");
    expect(formatSortieLabel({ area: "6", info: "5" }, 3, "number")).toBe("6-5 (3)");
  });

  it("日本語形式ではカタログの海域名に変換する", () => {
    // areas.json: 2-3 = 東部オリョール海（recorder 実データで 2-3 を確認済み）
    expect(formatSortieLabel({ area: "2", info: "3" }, 1, "japanese")).toBe("東部オリョール海 (1)");
  });

  it("日本語形式でもカタログ未収録の海域は番号形式へフォールバックする", () => {
    expect(formatSortieLabel({ area: "99", info: "9" }, 2, "japanese")).toBe("99-9 (2)");
  });

  it("map が null / undefined のときは null を返す（ラベル非表示）", () => {
    expect(formatSortieLabel(null, 1, "number")).toBeNull();
    expect(formatSortieLabel(undefined, 1, "japanese")).toBeNull();
  });

  it("連戦数 0 でも表示できる", () => {
    expect(formatSortieLabel({ area: "1", info: "1" }, 0, "number")).toBe("1-1 (0)");
  });
});
