// import "canvas";
import {DamageSnapshotCapture} from "../../../../../src/js/Applications/Background/Controllers/Message/DamageSnapshot";
import { fake } from "../../../../tools";

describe("DamageSnapshotControllers", () => {
  describe("DamageSnapshotCapture", () => {
    fake(chrome.tabs.query).callbacks([{}]);
    fake(chrome.tabs.captureVisibleTab).callbacks("data:image/png;base64,xxxxxx");
    it("TODO: なんかアサーションする", async () => {
      const res = await DamageSnapshotCapture({after: 0, key: "test"});
      expect(res.status).toBe(202);
    });
  });
});
