import DMM from "../../../src/js/Applications/Context/DMM";
import { fake } from "../../tools";
import { sleep } from "../../../src/js/utils";

describe("DMM context", () => {
  beforeAll(() => {
    Object.defineProperty(window.document, "querySelector", { value: () => window.document.createElement("iframe") });
  });
  describe("init", () => {
    fake(chrome.runtime.sendMessage).callbacks({});
    it("TODO: なんかアサーションする", async () => {
      const dmm = new DMM({...window, resizeBy: () => {/* */} } as any);
      fake(chrome.runtime.sendMessage).callbacks({ status: 405 });
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
  describe("onbeforeunload", () => {
    it("なんかする", () => {

      const dmm = new DMM({...window, resizeBy: () => {/* */} } as any);
      dmm.onbeforeunload(new Event("beforeunload"));
    });
  });
  describe("onresize", () => {
    it("なんかする", async () => {
      const dmm = new DMM({...window, resizeBy: () => {/* */} } as any);
      fake(chrome.runtime.sendMessage).callbacks({
        status: 200,
        data: {
          frame: { zoom: 1 },
          configs: {
            "inapp-mute-button": { value: true },
            "inapp-screenshot-button": { value: true },
          }
        }
      });
      await dmm.init();
      await sleep(210);
      dmm.onresize();
      await sleep(210);
      dmm.onresize();
    });
  });
});
