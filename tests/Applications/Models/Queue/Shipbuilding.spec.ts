import Shipbuilding from "../../../../src/js/Applications/Models/Queue/Shipbuilding";

describe("Shipbuilding Model", () => {
  describe("ひととおり", () => {
    it("なんかする", () => {
      const shipbuilding: Shipbuilding = Shipbuilding.new({dock: 2});
      expect(shipbuilding.registeredOn(2)).toBe(true);
      expect(shipbuilding.getTimerLabel()).toBe("第2ドック 建造");
      Shipbuilding.scan();
    });
  });
});
