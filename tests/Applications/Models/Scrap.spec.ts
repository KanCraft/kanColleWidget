import Scrap from "../../../src/js/Applications/Models/Scrap";

describe("Scrap", () => {
  describe("new", () => {
    it("なんかする", () => {
      const scrap = Scrap.new<Scrap>();
      expect(scrap._id).toBeUndefined();
      expect(scrap.filename.startsWith("scrap-")).toBe(true);
    });
  });
});
