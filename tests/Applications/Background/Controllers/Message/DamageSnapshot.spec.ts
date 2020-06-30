// import "canvas";
import {
  DamageSnapshotCapture,
  DamageSnapshotRecord,
} from "../../../../../src/js/Applications/Background/Controllers/Message/DamageSnapshot";
import { fake } from "../../../../tools";
import DamageSnapshotFrame, { DamageSnapshotType } from "../../../../../src/js/Applications/Models/DamageSnapshotFrame";

describe("DamageSnapshotControllers", () => {
  describe("DamageSnapshotCapture", () => {
    fake(chrome.tabs.query).callbacks([{}]);
    fake(chrome.tabs.captureVisibleTab).callbacks("data:image/png;base64,xxxxxx");
    it("TODO: なんかアサーションする", async () => {
      DamageSnapshotFrame.get().update({ value: DamageSnapshotType.InApp });
      let res = await DamageSnapshotCapture({after: 0, key: "test"});
      expect(res.status).toBe(202);
      DamageSnapshotFrame.get().update({ value: DamageSnapshotType.Separate });
      res = await DamageSnapshotCapture({after: 0, key: "test"});
      expect(res.status).toBe(202);
    });
  });
  describe("DamageSnapshotRecord", () => {
    it("なんかする", async () => {
      const res = await DamageSnapshotRecord({
        position: { left: 0, top: 0 },
        size: { height: 120 },
      });
      expect(res.status).toBe(200);
    });
  });
});
