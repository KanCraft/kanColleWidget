import {
  OnRecoveryStart,
  OnRecoveryStartCompleted,
  OnRecoveryHighspeed,
  OnRecoveryPrepare,
} from "../../../../../src/js/Applications/Background/Controllers/Request/Recovery";
import { dummyrequest, Fetch, fake } from "../../../../tools";

describe("Recovery Controllers", () => {
  describe("OnRecoveryStart", () => {
    it("TODO: アサーションする", async () => {
      const req = dummyrequest({ requestBody: { formData: { "api_ndock_id": [1], "api_highspeed": [1] } } });
      const res = await OnRecoveryStart(req);
      expect(res.status).toBe(200);
    });
  });
  describe("OnRecoveryStartCompleted", () => {
    fake(chrome.tabs.query).callbacks([{}]);
    fake(chrome.tabs.captureVisibleTab).callbacks("data:image/png;base64,xxxxx");
    it("Start時につくられたdock情報で、入渠モデルを作成・登録する", async () => {
      const req = dummyrequest({ debug: { dock: 1 } });
      Fetch.replies({ result: "12:34:56" });
      fake(chrome.notifications.create).callbacks({});
      const res = await OnRecoveryStartCompleted(req);
      expect(res.status).toBe(202);
    });
  });
  describe("OnRecoveryHighspeed", () => {
    it("登録済みタイマーをキャンセルする", async () => {
      const req = dummyrequest({ requestBody: { formData: { api_ndock_id: [1] } } });
      await OnRecoveryHighspeed(req);
    });
  });
  describe("OnRecoveryPrepare", () => {
    it("なんかする", async () => {
      fake(chrome.notifications.getAll).callbacks({ "Recovery?ts=1234": true, "Mission?ts=1234": true });
      fake(chrome.notifications.clear).callbacks({});
      await OnRecoveryPrepare();
    });
  });
});
