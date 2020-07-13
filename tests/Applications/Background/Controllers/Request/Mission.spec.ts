import {
  OnMissionStart, OnMissionInterruption, OnMissionResult,
} from "../../../../../src/js/Applications/Background/Controllers/Request/Mission";
import { dummyrequest, fake } from "../../../../tools";

describe("Mission Controllers", () => {
  describe("OnMissionStart", () => {
    it("formDataの内容からmissionモデルを作成し、登録する", async () => {
      fake(chrome.notifications.create).callbacks({});
      const req = dummyrequest({ requestBody: { formData: { "api_mission_id": [2], "api_deck_id": [3] } } });
      const res = await OnMissionStart(req);
      expect(res.status).toBe(202);
      expect(res.mission.title).toBe("長距離練習航海");
      expect(res.mission.deck).toBe(3);
    });
  });
  describe("OnMissionInterruption", () => {
    it("なんかする", () => {
      const req = dummyrequest({ requestBody: { formData: { "api_mission_id": [2], "api_deck_id": [3] } } });
      OnMissionInterruption(req);
    });
  });
  describe("OnMissionResult", () => {
    it("なんかする", async () => {
      fake(chrome.notifications.getAll).callbacks({});
      fake(chrome.notifications.clear).callbacks({});
      await OnMissionResult();
    });
  });
});
