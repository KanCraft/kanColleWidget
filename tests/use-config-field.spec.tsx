import { expect, describe, it, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import { useConfigField } from "../src/page/components/options/useConfigField";
import { FleetCaptureConfig } from "../src/models/configs/FleetCaptureConfig";
import { DashboardConfig } from "../src/models/configs/DashboardConfig";

// jstorm はストレージが空の間 static default オブジェクトをそのまま返し、update() は
// そのオブジェクトへ書き込む。テスト間の汚染を防ぐため毎回復元する。
const pristineFleetCaptureDefaults = structuredClone(FleetCaptureConfig.default);
const pristineDashboardDefaults = structuredClone(DashboardConfig.default);

beforeEach(() => {
  FleetCaptureConfig.default = structuredClone(pristineFleetCaptureDefaults);
  DashboardConfig.default = structuredClone(pristineDashboardDefaults);
});

describe("useConfigField", () => {
  // (a) save() がストレージへ永続化し、別途 Model.find で再取得しても値が反映されていることを確認する
  it("save() が chrome.storage(メモリ) へ永続化し、Model.find で再取得できる", async () => {
    const config = await FleetCaptureConfig.user();
    const { result } = renderHook(() => useConfigField(config, "background", config.background));

    await act(async () => {
      await result.current[1]("#123456");
    });

    expect(result.current[0]).toBe("#123456");
    const reloaded = await FleetCaptureConfig.user();
    expect(reloaded.background).toBe("#123456");
  });

  // (b) normalize の結果が state（表示値）と保存値の両方に反映されることを確認する
  it("normalize が保存値・表示値の両方に適用される", async () => {
    const config = await DashboardConfig.user();
    const { result } = renderHook(() =>
      useConfigField(config, "width", config.width, {
        normalize: (v: number) => (Number.isFinite(v) ? Math.trunc(v) : 600),
      }),
    );

    // 小数は trunc され、表示値(state)にも保存値にも同じ整数が反映される
    await act(async () => {
      await result.current[1](150.7);
    });
    expect(result.current[0]).toBe(150);
    expect((await DashboardConfig.user()).width).toBe(150);

    // NaN は既定値へフォールバックする
    await act(async () => {
      await result.current[1](NaN);
    });
    expect(result.current[0]).toBe(600);
    expect((await DashboardConfig.user()).width).toBe(600);
  });

  // (c) config.update が失敗したとき、setState に到達せず state が保存前の値のまま保たれることを確認する
  it("config.update が reject したとき state が変わらない", async () => {
    const config = await FleetCaptureConfig.user();
    const { result } = renderHook(() => useConfigField(config, "background", config.background));
    vi.spyOn(config, "update").mockRejectedValue(new Error("update failed"));

    await act(async () => {
      await expect(result.current[1]("#000000")).rejects.toThrow("update failed");
    });

    expect(result.current[0]).toBe("#ffffff");
  });
});
