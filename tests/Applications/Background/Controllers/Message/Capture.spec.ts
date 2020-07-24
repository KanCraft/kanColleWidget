// import "canvas";
import { Screenshot } from "../../../../../src/js/Applications/Background/Controllers/Message/Capture";
import { fake } from "../../../../tools";

describe("CaptureControllers", () => {
  describe("ScreenshotController", () => {
    fake(chrome.tabs.query).callbacks([{}]);
    fake(chrome.tabs.captureVisibleTab).callbacks("data:image/png;base64,xxx");
    fake(chrome.storage.local.get).callbacks({});
    fake(chrome.storage.local.set).callbacks({});
    it("TODO: なんかアサーションする", async () => {
      const res = await Screenshot();
      expect(res.status).toBe(202);
    });
  });
});
