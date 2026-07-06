import { expect, describe, it } from "vitest";

import { quests, QuestCategory } from "../src/catalog";

const KNOWN_CATEGORIES: QuestCategory[] = [
  "sortie", "supply", "mission", "recovery", "shipbuilding",
  "createitem", "remodel", "destroyship", "destroyitem", "practice",
];

// quests.json は as unknown as QuestCatalog でキャストしているだけで実行時検証がないため、
// カタログ自体の整合性（参照する前提任務IDの実在、カテゴリ値の妥当性）をここで担保する。
describe("quests カタログの整合性", () => {
  const entries = Object.entries(quests);

  it.each(entries)("id=%s の category は既知の値である", (_id, spec) => {
    expect(KNOWN_CATEGORIES).toContain(spec.category);
  });

  it.each(entries)("id=%s の requires が参照する任務は全てカタログに存在する", (_id, spec) => {
    for (const requiredId of spec.requires) {
      expect(quests[String(requiredId)]).toBeDefined();
    }
  });

  it("演習カテゴリは303→304の連鎖を持つ", () => {
    expect(quests["303"].requires).toEqual([]);
    expect(quests["304"].requires).toEqual([303]);
  });

  it("出撃カテゴリの211/212は日付条件を持つ", () => {
    expect(quests["211"].condition).toBe("date037");
    expect(quests["212"].condition).toBe("date28");
  });
});
