import {
  OnShipbuildingStart,
  OnShipbuildingStartCompleted,
} from "../../../../../src/js/Applications/Background/Controllers/Request/Shipbuilding";
import { dummyrequest, Fetch, when } from "../../../../tools";

describe("", () => {
  describe("OnShipbuildingStart", () => {
    it("TODO: アサーションする", async () => {
      const req = dummyrequest({ requestBody: { formData: { api_kdock_id: [2], api_highspeed: [1] } } });
      const res = await OnShipbuildingStart(req);
      expect(res.status).toBe(200);
    });
  });
  describe("OnShipbuildingStartCompleted", () => {
    when(chrome.tabs.query).callbacks([{}]);
    when(chrome.tabs.captureVisibleTab).callbacks("data:image/png;base64,xxxx");
    Fetch.replies({ result: "12:34:56" });
    it("建造モデルを作成・登録", async () => {
      const req = dummyrequest();
      const res = await OnShipbuildingStartCompleted(req);
      expect(res.status).toBe(202);
    });
  });
});
