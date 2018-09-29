// import "canvas";
import {DamageSnapshotCapture} from "../../../../../src/js/Applications/Background/Controllers/Message/DamageSnapshot";
import {when} from "../../../../tools";

describe("DamageSnapshotControllers", () => {
  describe("DamageSnapshotCapture", () => {
    when(chrome.tabs.query).callbacks([{}]);
    when(chrome.tabs.captureVisibleTab).callbacks("data:image/png;base64,xxxxxx");
    Object.defineProperty(HTMLImageElement.prototype, "src", { set(src) { this.onload(); }, get() { return; } });
    it("TODO: なんかアサーションする", async () => {
      const res = await DamageSnapshotCapture({after: 0, key: "test"});
      expect(res.status).toBe(202);
    });
  });
});
