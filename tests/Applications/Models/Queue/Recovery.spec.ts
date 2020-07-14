import Recovery from "../../../../src/js/Applications/Models/Queue/Recovery";

describe("Recovery Model", () => {
  describe("ひととおり", () => {
    it("なんかする", () => {
      const recovery: Recovery = Recovery.new({dock: 2});
      expect(recovery.registeredOn(2)).toBe(true);
      expect(recovery.getTimerLabel()).toBe("第2ドック 修復");
      Recovery.scan();
    });
  });
});
