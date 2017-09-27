/* global describe it expect jest */
jest.unmock("chomex");
jest.unmock("../../src/js/Application/Models/Queue/Queue");
import {Mission} from "../../src/js/Application/Models/Queue/Queue";

// Dependencies
jest.unmock("../../src/js/Services/Assets");
jest.unmock("../../src/js/Application/Models/Config");
import Config from "../../src/js/Application/Models/Config";

describe("Mission Model", () => {
  describe("toNotificationID", () => {
    it("`mission.${ミッションID}`というフォーマットの文字列を返す", () => {
      const deck = 2, id = 0;
      let mission = new Mission(Date.now(), "<manual>", deck, id);
      expect(mission.toNotificationID()).toBe("mission.0");
    });
  });
  describe("toNotificationParams", () => {
    it("個別設定されたアイコンURLか、なければデフォルト値を返す", () => {
      let mission = new Mission(Date.now(), "<manual>", 1, 0);
      expect(mission.toNotificationParams().iconUrl).toBe("this is default");

      let config = Config.find("notification-for-mission");
      config.icon = "my custom icon";
      config.save();

      expect(mission.toNotificationParams().iconUrl).toBe("my custom icon");
    });
  });
});
