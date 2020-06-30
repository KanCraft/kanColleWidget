import NotificationSetting from "../../../src/js/Applications/Models/Settings/NotificationSetting";
import { Kind } from "../../../src/js/Applications/Models/Queue/Queue";

describe("NotificationSetting", () => {
  describe("hoge", () => {
    it("なんかする", () => {
      const setting = NotificationSetting.find<NotificationSetting>(Kind.Mission);
      expect(setting.enabled).toBe(true);
      expect(setting.getSound()).toBeUndefined();
      expect(setting.getIcon()).toBe(NotificationSetting.defaultIcon);
    });
  });
});
