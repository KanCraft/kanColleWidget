import DMM from "../../../src/js/Applications/Context/DMM";
import { fake } from "../../tools";

describe("DMM context", () => {
  describe("DMM: dmm.com の context", () => {
    fake(chrome.runtime.sendMessage).callbacks({});
    it("TODO: なんかアサーションする", async () => {
      const dmm = new DMM({...window, resizeBy: () => {/* */} } as any);
      fake(chrome.runtime.sendMessage).callbacks({ status: 405 });
      Object.defineProperty(window.document, "querySelector", { value: () => window.document.createElement("iframe") });
      await dmm.init();
      fake(chrome.runtime.sendMessage).callbacks({
        status: 200,
        data: {
          tab: {}, frame: {}, configs: { "inapp-mute-button": { value: false }, "inapp-screenshot-button": {value: false} },
        }
      });
      await dmm.init();
      dmm.onresize();
      expect(dmm.listener()).toBeInstanceOf(Function);
      expect(dmm.interval()).toBeInstanceOf(Function);
    });
  });
});
