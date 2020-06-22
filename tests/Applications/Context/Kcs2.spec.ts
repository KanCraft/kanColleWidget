import Kcs2 from "../../../src/js/Applications/Context/Kcs2";
import { fake } from "../../tools";

describe("KCS2 context", () => {
  describe("Kcs2: kcs2 の context", () => {
    fake(chrome.runtime.sendMessage).callbacks({});
    it("TODO: なんかアサーションする", async () => {
      const dmm = new Kcs2(window);
      await dmm.init();
      expect(dmm.listener()).toBeInstanceOf(Function);
    });
  });
});
