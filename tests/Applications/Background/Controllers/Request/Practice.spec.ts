import { OnPracticePrepare } from "../../../../../src/js/Applications/Background/Controllers/Request/Practice";
import { fake } from "../../../../tools";

describe("Practice Controllers", () => {
  describe("OnPracticePrepare", () => {
    it("なんかする", async () => {
      fake(chrome.notifications.create).callbacks({});
      await OnPracticePrepare();
    });
  });
});
