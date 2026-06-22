import { expect, describe, it } from "vitest";

import { resolveDefaultFrameId, MEMORY_FRAME_ID } from "../src/models/popupDefaultFrame";
import { GameWindowConfig } from "../src/models/configs/GameWindowConfig";

describe("resolveDefaultFrameId", () => {
  const frameIds = ["__memory__", "__original__", "__classic__", "user-1234"];

  it("保存IDが一覧に存在すればそれを返す", () => {
    expect(resolveDefaultFrameId(frameIds, "__classic__")).toBe("__classic__");
    expect(resolveDefaultFrameId(frameIds, "user-1234")).toBe("user-1234");
  });

  it("保存IDが一覧に無ければ MEMORY にフォールバックする（削除済みID対策）", () => {
    expect(resolveDefaultFrameId(frameIds, "user-deleted")).toBe("__memory__");
  });

  it("既定の __memory__ はそのまま MEMORY を返す（後方互換）", () => {
    expect(resolveDefaultFrameId(frameIds, MEMORY_FRAME_ID)).toBe("__memory__");
  });

  it("Frame 一覧が空でも MEMORY にフォールバックする", () => {
    expect(resolveDefaultFrameId([], "__classic__")).toBe("__memory__");
  });
});

describe("GameWindowConfig.lastSelectedFrameId", () => {
  it("インスタンスの既定は __memory__", () => {
    expect(new GameWindowConfig().lastSelectedFrameId).toBe(MEMORY_FRAME_ID);
  });

  it("static default も __memory__", () => {
    expect(GameWindowConfig.default.user.lastSelectedFrameId).toBe(MEMORY_FRAME_ID);
  });
});

// jstorm/testing の installMemoryStorage（tests/setup.ts で各テスト前に注入）を実際に
// 経由した storage round-trip。Model 層が拡張外でも動くことを検証する。
describe("GameWindowConfig storage round-trip (jstorm/testing)", () => {
  it("user() は既定で __memory__ を返し、update が in-memory storage に永続化される", async () => {
    const before = await GameWindowConfig.user();
    expect(before.lastSelectedFrameId).toBe(MEMORY_FRAME_ID);

    await before.update({ lastSelectedFrameId: "__classic__" });

    const after = await GameWindowConfig.user();
    expect(after.lastSelectedFrameId).toBe("__classic__");
  });
});
