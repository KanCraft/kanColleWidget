import FileService from "../../src/js/Services/Files";

describe("FileService", () => {
  describe("save", () => {
    it("なんかする", async () => {
      const fs = new FileService("test_kcw");
      await fs.init();
      expect(fs.prefix).toBe("test_kcw");
    });
  });
});