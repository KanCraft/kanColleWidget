import {
  OnRecoveryStart,
  OnRecoveryStartCompleted,
} from "../../../../../src/js/Applications/Background/Controllers/Request/Recovery";
import { dummyrequest, Fetch, when } from "../../../../tools";

describe("Recovery Controllers", () => {
  describe("OnRecoveryStart", () => {
    it("TODO: アサーションする", async () => {
      const req = dummyrequest({ requestBody: { formData: { api_ndock_id: [1], api_highspeed: [1] } }});
      const res = await OnRecoveryStart(req);
      expect(res.status).toBe(200);
    });
  });
  describe("OnRecoveryStartCompleted", () => {
    when(chrome.tabs.query).callbacks([{}]);
    when(chrome.tabs.captureVisibleTab).callbacks("data:image/png;base64,xxxxx");
    Object.defineProperty(HTMLImageElement.prototype, "src", {set(src) { this.onload(); }, get() { return; }});
    Fetch.replies({ result: "12:34:56" });
    it("Start時につくられたdock情報で、入渠モデルを作成・登録する", async () => {
      const req = dummyrequest();
      const res = await OnRecoveryStartCompleted(req);
      expect(res.status).toBe(202);
      expect(res.recovery.dock).toBe(1);
    });
  });
});
