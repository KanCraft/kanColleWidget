import Sortie from "../../../src/js/Applications/Models/Sortie";
import { SortieContextType } from "../../../src/js/Applications/Models/Settings/SortieContextSetting";

describe("Sortie Model", () => {
  describe("今どこの海域で何戦目なのか記録する", () => {
    it("戦闘前後のリクエストを検知し、テキストを変更できる", () => {
      const ctx = Sortie.context();
      ctx.start(2, 5);

      // {{{ 1戦目
      // ctx.battle(); // https://github.com/KanCraft/kanColleWidget/issues/1232
      ctx.result();
      expect(ctx.toText(SortieContextType.Disabled)).toBe("");
      expect(ctx.toText(SortieContextType.Short)).toBe("2-5 (1)");
      // }}}
      ctx.next();

      // {{{ 2戦目
      ctx.battle();
      ctx.result();
      expect(ctx.toText(SortieContextType.Short)).toBe("2-5 (2)");
      expect(ctx.toText(SortieContextType.Full)).toBe("2戦目/沖ノ鳥島沖/南西諸島海域");
      // }}}
      ctx.next();

      ctx.refresh();
    });
  });
});