import { OnUpdateAvailable } from "../../../../src/js/Applications/Background/Controllers/Meta";
import { fake } from "../../../tools";

describe("OnUpdateAvailable", () => {
  it("勝手なアップデートがあれば通知を出す", async () => {
    fake(chrome.notifications.create).callbacks({});
    OnUpdateAvailable({ version: "12.34.56" });
  });
});