import NotificationSetting from "../../../src/js/Applications/Models/Settings/NotificationSetting";

describe("NotificationSetting", () => {
  describe("hoge", () => {
    it("なんかする", () => {
      const setting = NotificationSetting.find<NotificationSetting>("mission");
      expect(setting.enabled).toBe(true);
      expect(setting.getSound()).toBeUndefined();
      expect(setting.toChromeOptions().iconUrl).toBe(NotificationSetting.defaultIcon);
    });
  });
});
