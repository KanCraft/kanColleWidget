import {
  OnMissionStart,
} from "../../../../../src/js/Applications/Background/Controllers/Request/Mission";
import { dummyrequest } from "../../../../tools";

describe("Mission Controllers", () => {
  describe("OnMissionStart", () => {
    it("formDataの内容からmissionモデルを作成し、登録する", async () => {
      const req = dummyrequest({ requestBody: { formData: { api_mission_id: [2], api_deck_id: [3] } } });
      const res = await OnMissionStart(req);
      expect(res.status).toBe(202);
      expect(res.mission.title).toBe("長距離練習航海");
      expect(res.mission.deck).toBe(3);
    });
  });
});
