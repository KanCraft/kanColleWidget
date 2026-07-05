import { expect, describe, it } from "vitest";

import { CapturePreset } from "../src/models/CapturePreset";

// 編成キャプチャの組み込みプリセットの検証。
// これらはユーザーが削除・上書きできない前提（protected）で UI が組まれているため、
// 定義が欠けたり protected が外れたりすると削除ボタンの活性制御が壊れる。
describe("CapturePreset の組み込みプリセット", () => {
  const defaults = Object.values(CapturePreset.default);

  it("通常艦隊・連合艦隊・基地航空隊の3件があり、すべて protected である", () => {
    expect(defaults.map((preset) => preset.name)).toEqual(["通常艦隊", "連合艦隊", "基地航空隊"]);
    defaults.forEach((preset) => expect(preset.protected).toBe(true));
  });

  it("連合艦隊は第一・第二艦隊を横に並べる3行4列のグリッドを持つ", () => {
    const combined = CapturePreset.default.__combined__;
    expect(combined.composition).toHaveLength(3);
    combined.composition.forEach((row) => expect(row).toHaveLength(4));
  });

  it("切り抜き範囲はゲーム描画領域（0〜1）に収まる", () => {
    defaults.forEach((preset) => {
      expect(preset.rect.x).toBeGreaterThanOrEqual(0);
      expect(preset.rect.y).toBeGreaterThanOrEqual(0);
      expect(preset.rect.x + preset.rect.w).toBeLessThanOrEqual(1);
      expect(preset.rect.y + preset.rect.h).toBeLessThanOrEqual(1);
    });
  });
});
