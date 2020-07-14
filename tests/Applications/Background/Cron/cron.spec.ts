import {
  UpdateQueues,
} from "../../../../src/js/Applications/Background/Cron";
import { Clock } from "../../../tools";
import Recovery from "../../../../src/js/Applications/Models/Queue/Recovery";
import Shipbuilding from "../../../../src/js/Applications/Models/Queue/Shipbuilding";
import NotificationSetting from "../../../../src/js/Applications/Models/Settings/NotificationSetting";
import { Kind } from "../../../../src/js/Applications/Models/Queue/Queue";

describe("Cron", () => {
  describe("UpdateQueues", () => {
    it("TODO: なんかアサーションする", async () => {
      const clock = Clock.freeze("2020-07-07 22:00:00");
      Recovery.new<Recovery>({dock: 1}).register((new Date()).getTime());
      Shipbuilding.new<Shipbuilding>({dock: 2}).register((new Date()).getTime());
      NotificationSetting.find<NotificationSetting>(Kind.Shipbuilding).update({ enabled: false });
      UpdateQueues();
      clock.release();
    });
  });
});
