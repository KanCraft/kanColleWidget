import TempStorage from "../../src/js/Services/TempStorage";

describe("TempStorage", () => {
  describe("ひととおり", () => {
    it("なんかする", () => {
      const storage = new TempStorage();
      const key = storage.store("my_prefix", "THIS IS VALUE");
      expect(key).toMatch(/^my_prefix_.+$/);
      const value = storage.draw(key);
      expect(value).toBe("THIS IS VALUE");
    });
  });
});