import KanColleServerSetting from "../../../../src/js/Applications/Models/Settings/KanColleServerSetting";
import { fake } from "../../../tools";

describe("KanColleServerSetting", () => {
  describe("check", () => {
    it("なんかする", async () => {
      fake(chrome.permissions.contains).callbacks(true);
      const setting = KanColleServerSetting.user();
      expect(setting.servers.length).toBe(0);
      const res = await setting.check();
      expect(res).toBe(true);
    });
  });
  describe("add", () => {
    it("なんかする", async () => {
      fake(chrome.permissions.request).callbacks({});
      const setting = KanColleServerSetting.user();
      expect(setting.servers.length).toBe(0);
      await setting.add({name: "test", address: "192.168.0.1"});
      expect(setting.servers.length).toBe(1);
    });
  });
});