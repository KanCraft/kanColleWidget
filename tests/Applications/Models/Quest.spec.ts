import { QuestProgress } from "../../../src/js/Applications/Models/Quest";
import { Category } from "../../../src/js/Applications/Models/Quest/consts";

describe("QuestProgress", () => {
  describe("availables", () => {
    afterEach(() => {
      QuestProgress.drop();
    });
    it("未着手任務のリストを返す", () => {
      let avs = QuestProgress.user().availables(Category.Sortie);
      expect(avs.length).toBe(1);
      expect(avs[0].id).toBe(201);

      QuestProgress.user().start(201);
      avs = QuestProgress.user().availables(Category.Sortie);
      expect(avs.length).toBe(0);

      QuestProgress.user().complete(201);
      avs = QuestProgress.user().availables(Category.Sortie);
      expect(avs.length).toBe(3);
      expect(avs[0].id).toBe(211);
      expect(avs[1].id).toBe(212);
      expect(avs[2].id).toBe(216);
    });
  });
});
