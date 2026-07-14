import { expect, describe, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

// chromite（logger 経由で import される）はモジュール読み込み時に chrome.runtime を参照するため、
// import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = { runtime: { id: "test", onMessage: { addListener: () => {} } } };
});

// 「編成キャプチャ画面を開く」ボタンが参照する chrome API はテスト環境に無いためモックする
vi.mock("../src/services/Launcher", () => ({
  Launcher: class {
    static async fleetcapture() {
      return null;
    }
  },
}));

import { FleetCaptureSettingView } from "../src/page/components/options/FleetCaptureSettingView";
import { CapturePreset } from "../src/models/CapturePreset";
import { FleetCaptureConfig, TransparentBackground } from "../src/models/configs/FleetCaptureConfig";
import { restoreDefaultsBeforeEach } from "./helpers/jstorm-defaults";

restoreDefaultsBeforeEach(FleetCaptureConfig);

async function renderView() {
  const presets = await CapturePreset.list();
  const config = await FleetCaptureConfig.user();
  // FoldableSection は ?open=<id> が付いていると開いた状態で描画される
  const router = createMemoryRouter(
    [{ path: "/", element: <FleetCaptureSettingView presets={presets} config={config} /> }],
    { initialEntries: ["/?open=fleet-capture"] },
  );
  render(<RouterProvider router={router} />);
}

describe("FleetCaptureSettingView", () => {
  // 「透明にする」テストより先に検証する（jstorm はストレージが空の間 static default を
  // そのまま返すため、後続テストでの update が先行すると既定値の観測が汚染される）
  it("背景色の既定値は白", async () => {
    const config = await FleetCaptureConfig.user();
    expect(config.background).toBe("#ffffff");
  });

  it("組み込みプリセットの削除ボタンは無効化されている", async () => {
    await renderView();
    const deleteButtons = screen.getAllByRole("button", { name: "削除" });
    expect(deleteButtons).toHaveLength(3);
    deleteButtons.forEach((button) => expect(button).toBeDisabled());
  });

  it("「透明にする」をチェックすると背景色設定が transparent で保存される", async () => {
    await renderView();
    await userEvent.click(screen.getByRole("checkbox", { name: /透明にする/ }));
    const updated = await FleetCaptureConfig.user();
    expect(updated.background).toBe(TransparentBackground);
  });
});
