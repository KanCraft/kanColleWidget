import { expect, describe, it } from "vitest";

import { Rectangle } from "../src/services/CropService";

// Rectangle.relative の検証。
// 相対矩形（ゲーム描画領域基準の 0〜1）が、レターボックス/ピラーボックスを除いた
// ゲーム領域を基準に絶対ピクセル矩形へ変換されること。
describe("Rectangle.relative", () => {
  it("ゲームと同じアスペクト比の画像では単純にスケールされる", () => {
    const rect = new Rectangle(2400, 1440).relative({ x: 0.5, y: 0.25, w: 0.25, h: 0.5 });
    expect(rect.start).toEqual({ x: 1200, y: 360 });
    expect(rect.size).toEqual({ w: 600, h: 720 });
  });

  it("タテなが画像では上下のレターボックスを除いた領域が基準になる", () => {
    // 1200x820 の画像 → ゲーム領域は 1200x720、y=50 から
    const rect = new Rectangle(1200, 820).relative({ x: 0, y: 0, w: 1, h: 1 });
    expect(rect.start).toEqual({ x: 0, y: 50 });
    expect(rect.size).toEqual({ w: 1200, h: 720 });
  });

  it("ヨコなが画像では左右のピラーボックスを除いた領域が基準になる", () => {
    // 1300x720 の画像 → ゲーム領域は 1200x720、x=50 から
    const rect = new Rectangle(1300, 720).relative({ x: 0.5, y: 0, w: 0.5, h: 1 });
    expect(rect.start).toEqual({ x: 650, y: 0 });
    expect(rect.size).toEqual({ w: 600, h: 720 });
  });
});
