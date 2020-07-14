import Mission from "../../../../src/js/Applications/Models/Queue/Mission";

describe("Mission", () => {
  describe("for", () => {
    it("遠征IDからMissionモデルをつくる", () => {
      const mission = Mission.for(1, 1);
      expect(mission).toBeInstanceOf(Mission);
      expect(mission.title).toBe("練習航海");
    });
  });
  describe("register", () => {
    it("終了予定時刻を決定し、ストレージに入れる", () => {
      const mission = Mission.for(1, 1);
      mission.register();
      expect(mission.scheduled).toBeLessThanOrEqual(Date.now() + mission.time);
      const found = Mission.find<Mission>(mission._id);
      expect(mission.scheduled).toBe(found.scheduled);
    });
  });
  describe("scan", () => {
    it("未終了のものと終了したものをより分けて返す", () => {
      const scanned = Mission.scan();
      expect(scanned.upcomming).toBeInstanceOf(Array);
      expect(scanned.finished).toBeInstanceOf(Array);
    });
  });
  describe("その他もろもろ", () => {
    it("なんかする", async () => {
      const mission = Mission.for(1, 1);
      expect(mission.registeredOn(1)).toBe(true);
      expect(mission.getTimerLabel()).toBe("第1艦隊 練習航海");
    });
  });
});
