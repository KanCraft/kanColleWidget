import TimerDisplaySetting, { DisplayFormat } from "../../../../src/js/Applications/Models/Settings/TimerDisplaySetting";

describe("TimerDisplaySetting", () => {
  describe("user", () => {
    it("唯一の設定をとってくる", () => {
      const user = TimerDisplaySetting.user();
      expect(user.format).toBe(DisplayFormat.ScheduledTime);
    });
  });
});
