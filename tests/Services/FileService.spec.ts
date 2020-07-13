import FileService from "../../src/js/Services/Files";

describe("FileService", () => {
  describe("ひととおり", () => {
    it("なんかする", async () => {
      const fs = new FileService();
      await fs.init();
      await fs.save("test", new File([], "test"));
    });
  });
});
