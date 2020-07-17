import Const from "../../src/js/Constants";
import Rectangle from "../../src/js/Services/Rectangle";

describe("Rectangle", () => {
  describe("static new", () => {
    test("コンストラクタの省略にすぎないです", () => {
      const r = Rectangle.new(100, 200);
      expect(r instanceof Rectangle).toBe(true);
    });
  });
  describe("game", () => {
    test("ゲーム領域を抜き出したRectangleを新たに返す", () => {
      let r = Rectangle.new(Const.GameWidth, Const.GameHeight);
      let g = r.game();
      expect(r.aspect()).toBe(g.aspect());
      expect(r.size.w).toBe(g.size.w);
      // 横長だった場合
      r = Rectangle.new(Const.GameWidth * 2, Const.GameHeight);
      g = r.game();
      expect(r.aspect()).not.toBe(g.aspect());
      expect(g.aspect()).toBeLessThan(r.aspect());
      // 縦長だった場合
      r = Rectangle.new(Const.GameWidth, Const.GameHeight * 3);
      g = r.game();
      expect(r.aspect()).not.toBe(g.aspect());
      expect(g.aspect()).toBeGreaterThan(r.aspect());
    });
  });
  describe("reframe", () => {
    it("切り抜く", () => {
      const r = Rectangle.new(Const.GameWidth, Const.GameHeight);
      r.reframe({x: 0.1, y: 0.1, w: 0.1, h: 0.1});
    });
  });
});
