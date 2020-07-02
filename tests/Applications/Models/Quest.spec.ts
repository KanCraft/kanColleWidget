import { QuestProgress } from "../../../src/js/Applications/Models/Quest";
import { Category, Status, Group } from "../../../src/js/Applications/Models/Quest/consts";

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

  describe("shouldRefresh+refresh", () => {
    it("基本的にはデイリー任務を更新すべきかどうかのやつ", () => {
      QuestProgress.user().complete(201);
      expect(QuestProgress.user().quests[201].status).toBe(Status.Completed);
      const qp = QuestProgress.user();
      qp.lastRefreshed = new Date("2020-01-15 07:00");
      const groupsShouldBeUpdated = qp.shouldRefresh(new Date("2020-01-16 07:00"));
      expect(groupsShouldBeUpdated).toStrictEqual([Group.Daily]);
      qp.refresh(groupsShouldBeUpdated);
      expect(QuestProgress.user().quests[201].status).toBe(Status.Open);
    });
  });
});
