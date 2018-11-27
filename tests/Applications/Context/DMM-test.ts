import DMM from "../../../src/js/Applications/Context/DMM";
import {when} from "../../tools";

describe("DMM context", () => {
  describe("DMM: dmm.com の context", () => {
    when(chrome.runtime.sendMessage).callbacks({});
    it("TODO: なんかアサーションする", async () => {
      const dmm = new DMM(window);
      await dmm.init();
      dmm.onresize();
      expect(dmm.listener()).toBeInstanceOf(Function);
      expect(dmm.interval()).toBeInstanceOf(Function);
    });
  });
});
