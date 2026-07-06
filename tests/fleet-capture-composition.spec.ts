import { expect, describe, it } from "vitest";

import { resizeComposition, resizeResultSet } from "../src/page/fleet-capture/composition";

// グリッドサイズ変更ヘルパの検証。
// 既存セルの内容（ラベル・キャプチャ）を保持したまま行数・列数を変更できること。
describe("resizeComposition", () => {
  const base = [
    ["旗艦", "第二艦"],
    ["第三艦", "第四艦"],
  ];

  it("拡大時は既存ラベルを保持し、新セルには「行-列」形式のラベルを与える", () => {
    expect(resizeComposition(base, 3, 3)).toEqual([
      ["旗艦", "第二艦", "1-3"],
      ["第三艦", "第四艦", "2-3"],
      ["3-1", "3-2", "3-3"],
    ]);
  });

  it("縮小時ははみ出したセルを切り捨てる", () => {
    expect(resizeComposition(base, 1, 1)).toEqual([["旗艦"]]);
  });
});

describe("resizeResultSet", () => {
  it("既存のキャプチャを保持し、新セルは未撮影（null）にする", () => {
    const base = [
      ["a", null],
      [null, "b"],
    ];
    expect(resizeResultSet(base, 3, 2)).toEqual([
      ["a", null],
      [null, "b"],
      [null, null],
    ]);
  });
});
