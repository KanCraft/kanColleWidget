import { expect, describe, it } from "vitest";

import { BehaviorConfig, QueueWatchIntervalOptions } from "../src/models/configs/BehaviorConfig";

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

// タイマー監視間隔（Queue の期限確認間隔）の既定値・保存・正規化のルール。
describe("BehaviorConfig.queueWatchIntervalSeconds", () => {
  it("未保存のときは既定の30秒が返る", async () => {
    const config = await BehaviorConfig.user();
    expect(config.queueWatchIntervalSeconds).toBe(30);
    expect(config.normalizedQueueWatchIntervalSeconds()).toBe(30);
  });

  it("保存した監視間隔を読み出せる", async () => {
    const config = await BehaviorConfig.user();
    await config.update({ queueWatchIntervalSeconds: 5 });
    const reloaded = await BehaviorConfig.user();
    expect(reloaded.queueWatchIntervalSeconds).toBe(5);
  });

  it.each([...QueueWatchIntervalOptions])("選択肢の値 %d はそのまま正規化結果になる", (seconds) => {
    const config = new BehaviorConfig();
    config.queueWatchIntervalSeconds = seconds;
    expect(config.normalizedQueueWatchIntervalSeconds()).toBe(seconds);
  });

  it("選択肢にない保存値は既定の30秒に正規化される", () => {
    const config = new BehaviorConfig();
    config.queueWatchIntervalSeconds = 7;
    expect(config.normalizedQueueWatchIntervalSeconds()).toBe(30);
  });

  it("選択肢はいずれもアラーム周期（30秒）以下", () => {
    for (const seconds of QueueWatchIntervalOptions) {
      expect(seconds).toBeLessThanOrEqual(BehaviorConfig.ALARM_PERIOD_SECONDS);
    }
  });
});
