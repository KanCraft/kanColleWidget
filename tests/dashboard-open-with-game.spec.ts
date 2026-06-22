import { expect, describe, it } from "vitest";

import { DashboardConfig } from "../src/models/configs/DashboardConfig";

// #1216: ゲーム窓の起動に合わせてダッシュボードを自動で開くかの判定ルール。
describe("DashboardConfig.shouldOpenOnLaunch", () => {
  it("既定（openWithGame=false）では新規/既存どちらでも開かない", () => {
    const config = new DashboardConfig();
    expect(config.openWithGame).toBe(false); // 既定は OFF（後方互換）
    expect(config.shouldOpenOnLaunch(false)).toBe(false);
    expect(config.shouldOpenOnLaunch(true)).toBe(false);
  });

  it("openWithGame=true かつ 新規作成（existed=false）のときだけ開く", () => {
    const config = new DashboardConfig();
    config.openWithGame = true;
    expect(config.shouldOpenOnLaunch(false)).toBe(true);
  });

  it("openWithGame=true でも既存ゲーム窓の再フォーカス（existed=true）では開かない", () => {
    const config = new DashboardConfig();
    config.openWithGame = true;
    expect(config.shouldOpenOnLaunch(true)).toBe(false);
  });

  it("static default の openWithGame も false", () => {
    expect(DashboardConfig.default.user.openWithGame).toBe(false);
  });
});
