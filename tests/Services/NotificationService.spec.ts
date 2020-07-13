import NotificationService from "../../src/js/Services/Notification";
import {fake} from "../tools";

describe("NotificationService", () => {
  describe("ひととおり", () => {
    it("なんかする", async () => {
      fake(chrome.notifications.getAll).callbacks({"Foo": true, "Baa": true, "Baz": true});
      const service = new NotificationService();
      await service.clearAll(/^Ba.+$/);
    });
  });
});
