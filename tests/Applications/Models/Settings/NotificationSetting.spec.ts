import NotificationSetting from "../../../../src/js/Applications/Models/Settings/NotificationSetting";
import { Kind } from "../../../../src/js/Applications/Models/Queue/Queue";
import Shipbuilding from "../../../../src/js/Applications/Models/Queue/Shipbuilding";

describe("NotificationSetting", () => {
  describe("hoge", () => {
    it("なんかする", () => {
      const setting = NotificationSetting.find<NotificationSetting>(Kind.Mission);
      expect(setting.enabled).toBe(true);
      expect(setting.getSound()).toBeUndefined();
      expect(setting.getIcon()).toBe(NotificationSetting.defaultIcon);
    });
  });
  describe("getFileSystemIconPath", () => {
    it("なんかする", () => {
      const setting: NotificationSetting = NotificationSetting.find(Kind.Recovery);
      setting.getFileSystemIconPath();
    });
  });
  describe("getFileSystemSoundPath", () => {
    it("なんかする", () => {
      const setting: NotificationSetting = NotificationSetting.find(Kind.Shipbuilding);
      setting.getFileSystemSoundPath();
    });
  });
  describe("getChromeOptions", () => {
    it("なんかする", () => {
      const queue = new Shipbuilding();
      const setting: NotificationSetting = NotificationSetting.find(Kind.Shipbuilding);
      setting.getChromeOptions(queue);
    });
  });
});
