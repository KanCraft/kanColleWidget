import TirednessTimerSetting, {ClickAction} from "../../../../src/js/Applications/Models/Settings/TirednessTimerSetting";

describe("TirednessTimerSetting", () => {
  describe("user", () => {
    it("唯一の設定をとってくる", () => {
      const user = TirednessTimerSetting.user();
      expect(user.clickAction).toBe(ClickAction.RemoveConfirm);
    });
  });
});
