import Kcs2 from "../../../src/js/Applications/Context/Kcs2";
import {when} from "../../tools";

describe("KCS2 context", () => {
  describe("Kcs2: kcs2 の context", () => {
    when(chrome.runtime.sendMessage).callbacks({});
    it("TODO: なんかアサーションする", async () => {
      const dmm = new Kcs2(window);
      await dmm.init();
      expect(dmm.listener()).toBeInstanceOf(Function);
    });
  });
});
