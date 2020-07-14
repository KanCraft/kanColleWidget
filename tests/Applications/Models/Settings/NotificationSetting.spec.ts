import NotificationSetting from "../../../../src/js/Applications/Models/Settings/NotificationSetting";
import { Kind } from "../../../../src/js/Applications/Models/Queue/Queue";
import Shipbuilding from "../../../../src/js/Applications/Models/Queue/Shipbuilding";
import Tiredness from "../../../../src/js/Applications/Models/Queue/Tiredness";
import Mission from "../../../../src/js/Applications/Models/Queue/Mission";
import Recovery from "../../../../src/js/Applications/Models/Queue/Recovery";

describe("NotificationSetting", () => {
  describe("hoge", () => {
    it("なんかする", () => {
      const setting = NotificationSetting.find<NotificationSetting>(Kind.Mission);
      expect(setting.enabled).toBe(true);
      expect(setting.getSound()).toBeUndefined();
      expect(setting.getIcon()).toBe(NotificationSetting.defaultIcon);
      setting.getChromeOptions(Mission.new({deck: 1}));
    });
  });
  describe("getFileSystemIconPath", () => {
    it("なんかする", () => {
      const setting: NotificationSetting = NotificationSetting.find(Kind.Recovery);
      setting.getFileSystemIconPath();
      setting.getChromeOptions(Recovery.new({dock: 1}));
    });
  });
  describe("getFileSystemSoundPath", () => {
    it("なんかする", () => {
      const setting: NotificationSetting = NotificationSetting.find(Kind.Shipbuilding);
      setting.getFileSystemSoundPath();
      setting.getChromeOptions(Shipbuilding.new({dock: 1}));
    });
  });
  describe("getChromeOptions", () => {
    it("なんかする", () => {
      const shipbuilding = new Shipbuilding();
      let setting: NotificationSetting = NotificationSetting.find(Kind.Shipbuilding);
      setting.getChromeOptions(shipbuilding, false);
      const tiredness = new Tiredness();
      setting = NotificationSetting.find(Kind.Tiredness);
      setting.getChromeOptions(tiredness);
    });
  });
});
