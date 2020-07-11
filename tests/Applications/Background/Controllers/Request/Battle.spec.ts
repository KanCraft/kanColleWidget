import {
  OnAirBattleStarted,
  OnBattleResulted,
  OnBattleStarted,
  OnCombinedBattleResulted,
} from "../../../../../src/js/Applications/Background/Controllers/Request/Battle";
import { dummyrequest } from "../../../../tools";
import Sortie from "../../../../../src/js/Applications/Models/Sortie";

describe("Battle Controllers", () => {
  describe("OnAirBattleStarted", () => {
    it("TODO: なんかアサーションする", async () => {
      const req = dummyrequest();
      const res = await OnAirBattleStarted(req);
      expect(res.status).toBe(200);
    });
  });

  describe("OnBattleResulsted", () => {
    it("TODO: なんかアサーションする", async () => {
      const req = dummyrequest();
      Sortie.context().start(2, 5);
      const res = await OnBattleResulted(req);
      expect(res.status).toBe(200);
    });
  });

  describe("OnBattleStarted", () => {
    it("TODO: なんかアサーションする", async () => {
      const req = dummyrequest();
      const res = await OnBattleStarted(req);
      expect(res.status).toBe(200);
    });
  });

  describe("OnCombinedBattleResulted", () => {
    it("TODO: なんかアサーションする", async () => {
      const req = dummyrequest();
      Sortie.context().start(2, 5);
      const res = await OnCombinedBattleResulted(req);
      expect(res.status).toBe(200);
    });
  });
});
