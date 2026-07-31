import { expect, describe, it } from "vitest";

import { areas } from "../src/catalog";

// 通常海域の構成（海域番号 → その海域が持つマップ数）
const MAP_COUNTS: { [area: string]: number } = {
  "1": 6, "2": 5, "3": 5, "4": 5, "5": 6, "6": 5, "7": 5,
};

const ALL_KEYS = Object.entries(MAP_COUNTS).flatMap(
  ([area, count]) => Array.from({ length: count }, (_, i) => `${area}-${i + 1}`),
);

// areas.json は AreaCatalog へキャストしているだけで実行時検証がないため、
// カタログ自体の網羅性と一意性をここで担保する。
describe("areas カタログの整合性", () => {
  it.each(ALL_KEYS)("%s の海域名が収録されている", (key) => {
    expect(areas[key]).toBeTruthy();
  });

  it("通常海域以外のキーを含まない", () => {
    expect(Object.keys(areas).sort()).toEqual(ALL_KEYS.sort());
  });

  // 海域名が重複するのは、隣接する海域の名前がずれて入っている兆候（@see #1851）。
  it("海域名が重複しない", () => {
    const names = Object.values(areas);
    expect(new Set(names).size).toBe(names.length);
  });

  it.each([
    ["2-2", "バシー海峡"],
    ["4-5", "カレー洋リランカ島沖"],
    ["5-6", "ラバウル方面海域"],
    ["7-5", "ジャワ島沖"],
  ])("%s の海域名は %s である", (key, name) => {
    expect(areas[key]).toBe(name);
  });
});
