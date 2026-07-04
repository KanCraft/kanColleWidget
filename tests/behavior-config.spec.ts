import { expect, describe, it } from "vitest";

import { BehaviorConfig } from "../src/models/configs/BehaviorConfig";

// 細かい挙動設定（BehaviorConfig）の既定値と保存・読み出し。
describe("BehaviorConfig", () => {
  it("既定では restackFatigueOnSortie は false（疲労タイマーは出撃ごとに積み上がる）", async () => {
    const config = await BehaviorConfig.user();
    expect(config.restackFatigueOnSortie).toBe(false);
  });

  it("static default の restackFatigueOnSortie も false", () => {
    expect(BehaviorConfig.default.user.restackFatigueOnSortie).toBe(false);
  });

  it("update で保存した値を読み出せる", async () => {
    const config = await BehaviorConfig.user();
    await config.update({ restackFatigueOnSortie: true });
    const reloaded = await BehaviorConfig.user();
    expect(reloaded.restackFatigueOnSortie).toBe(true);
  });
});
