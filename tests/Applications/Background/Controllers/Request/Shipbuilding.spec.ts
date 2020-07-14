import {
  OnShipbuildingStart,
  OnShipbuildingStartCompleted,
  OnShipbuildingGetShip,
  OnShipbuildingHighspeed,
} from "../../../../../src/js/Applications/Background/Controllers/Request/Shipbuilding";
import { dummyrequest, Fetch, fake } from "../../../../tools";

describe("", () => {
  describe("OnShipbuildingStart", () => {
    it("TODO: アサーションする", async () => {
      const req = dummyrequest({ requestBody: { formData: { "api_kdock_id": [2], "api_highspeed": [1] } } });
      const res = await OnShipbuildingStart(req);
      expect(res.status).toBe(200);
    });
  });
  describe("OnShipbuildingStartCompleted", () => {
    fake(chrome.tabs.query).callbacks([{}]);
    fake(chrome.tabs.captureVisibleTab).callbacks("data:image/png;base64,xxxx");
    Fetch.replies({ result: "12:34:56" });
    it("建造モデルを作成・登録", async () => {
      let req = dummyrequest();
      let res = await OnShipbuildingStartCompleted(req);
      expect(res.status).toBe(202);
      req = dummyrequest({debug: {dock: 1}});
      Fetch.replies({ result: "12:34:56" });
      res = await OnShipbuildingStartCompleted(req);
      expect(res.status).toBe(202);
    });
  });
  describe("OnShipbuildingGetShip", () => {
    it("なんかする", async () => {
      fake(chrome.notifications.getAll).callbacks({"Foo": true});
      fake(chrome.notifications.clear).callbacks({});
      await OnShipbuildingGetShip();
    });
  });
  describe("OnShipbuildingHighspeed", () => {
    it("なんかする", async () => {
      const req = dummyrequest({ requestBody: { formData: { "api_kdock_id": [2] } } });
      await OnShipbuildingHighspeed(req);
    });
  });
});
