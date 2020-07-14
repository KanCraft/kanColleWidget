import Sortie from "../../../src/js/Applications/Models/Sortie";
import { SortieContextType } from "../../../src/js/Applications/Models/Settings/SortieContextSetting";

describe("Sortie Model", () => {
  describe("ひととおり", () => {
    it("なんかする", () => {
      const ctx = Sortie.context();
      ctx.start(2, 5);
      ctx.battle();
      ctx.result();
      expect(ctx.toText(SortieContextType.Disabled)).toBe("");
      expect(ctx.toText(SortieContextType.Short)).toBe("2-5 (1)");
      ctx.battle();
      ctx.result();
      expect(ctx.toText(SortieContextType.Short)).toBe("2-5 (2)");
      expect(ctx.toText(SortieContextType.Full)).toBe("2戦目/沖ノ鳥島沖/南西諸島海域");
      ctx.refresh();
    });
  });
});