import { expect, describe, it } from "vitest";

import { QuestTrackerConfig } from "../src/models/configs/QuestTrackerConfig";

// 任務トラッカーは既定で独立タブが導線。ダッシュボードへの表示はオプトイン。
describe("QuestTrackerConfig.showOnDashboard", () => {
  it("既定ではfalse（ダッシュボードには表示しない）", async () => {
    const config = await QuestTrackerConfig.user();
    expect(config.showOnDashboard).toBe(false);
  });

  it("static default の showOnDashboard も false", () => {
    expect(QuestTrackerConfig.default.user.showOnDashboard).toBe(false);
  });

  it("update で保存した値を読み出せる", async () => {
    const config = await QuestTrackerConfig.user();
    await config.update({ showOnDashboard: true });
    const reloaded = await QuestTrackerConfig.user();
    expect(reloaded.showOnDashboard).toBe(true);
  });
});
