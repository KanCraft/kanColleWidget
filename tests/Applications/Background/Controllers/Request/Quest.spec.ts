import {
  OnQuestStart,
  OnQuestStop,
  OnQuestComplete,
} from "../../../../../src/js/Applications/Background/Controllers/Request/Quest";
import { QuestProgress } from "../../../../../src/js/Applications/Models/Quest";
import { Category } from "../../../../../src/js/Applications/Models/Quest/consts";
import { dummyrequest, Clock } from "../../../../tools";

describe("QuestControllers", () => {
  describe("基本的なストーリー", () => {
    beforeAll(() => {
      QuestProgress.drop();
    });
    it("スタートしてストップしてスタートしてコンプリートするやつ", async () => {
      const clock = Clock.freeze("2020-07-02 22:00:00");

      let avs = QuestProgress.user().availables(Category.Sortie);
      expect(avs.length).toBe(1);
      expect(avs[0].id).toBe(201);

      await OnQuestStart(dummyrequest({ requestBody: { formData: { api_quest_id: ["201"] } } }));

      avs = QuestProgress.user().availables(Category.Sortie);
      expect(avs.length).toBe(0);

      await OnQuestStop(dummyrequest({ requestBody: { formData: { api_quest_id: ["201"] } } }));

      avs = QuestProgress.user().availables(Category.Sortie);
      expect(avs.length).toBe(1);
      expect(avs[0].id).toBe(201);

      await OnQuestStart(dummyrequest({ requestBody: { formData: { api_quest_id: ["201"] } } }));
      await OnQuestComplete(dummyrequest({ requestBody: { formData: { api_quest_id: ["201"] } } }));

      avs = QuestProgress.user().availables(Category.Sortie);
      expect(avs.length).toBe(2);
      expect(avs[0].id).toBe(212);
      expect(avs[1].id).toBe(216);

      clock.release();
    });
  });
});