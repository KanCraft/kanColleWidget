import DamageSnapshot from "../../../../src/js/Applications/Context/Features/DamageSnapshot";

describe("大破進撃防止窓のためのコンテキスト実装", () => {
  describe("DamageSnapshot", () => {
    it("TODO: なんかアサーションする", async () => {
      Object.defineProperty(window.document, "querySelector", { value: () => window.document.createElement("canvas") });
      const ds = new DamageSnapshot(window);
      ds.prepare({ count: 1, key: 12345 });
      ds.show({ uri: "data:image/png;base64,xxxx", height: 140 });
      ds.remove();
    });
  });
});
