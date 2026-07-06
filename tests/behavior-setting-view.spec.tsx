import { expect, describe, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

import { BehaviorSettingView } from "../src/page/components/options/BehaviorSettingView";
import { BehaviorConfig } from "../src/models/configs/BehaviorConfig";

// jstorm はストレージが空の間 static default オブジェクトをそのまま返し、update() は
// そのオブジェクトへ書き込む。テスト間の汚染を防ぐため毎回復元する。
const pristineDefaults = structuredClone(BehaviorConfig.default);

beforeEach(() => {
  BehaviorConfig.default = structuredClone(pristineDefaults);
});

async function renderView() {
  const config = await BehaviorConfig.user();
  // FoldableSection は ?open=<id> が付いていると開いた状態で描画される
  const router = createMemoryRouter(
    [{ path: "/", element: <BehaviorSettingView config={config} /> }],
    { initialEntries: ["/?open=behavior"] },
  );
  render(<RouterProvider router={router} />);
}

// 「出撃記録の保存期間」設定欄の表示・保存ルール。
describe("BehaviorSettingView 出撃記録の保存期間", () => {
  it("未設定のときは既定の7を表示する", async () => {
    await renderView();
    expect(screen.getByLabelText("出撃記録の保存期間")).toHaveValue(7);
  });

  it("入力を変更すると即座に保存される", async () => {
    await renderView();
    const input = screen.getByLabelText("出撃記録の保存期間");
    await userEvent.clear(input);
    await userEvent.type(input, "30");

    const reloaded = await BehaviorConfig.user();
    expect(reloaded.logbookRetentionDays).toBe(30);
  });

  it("0を入力すると無期限として保存される", async () => {
    await renderView();
    const input = screen.getByLabelText("出撃記録の保存期間");
    await userEvent.clear(input);
    await userEvent.type(input, "0");

    const reloaded = await BehaviorConfig.user();
    expect(reloaded.logbookRetentionDays).toBe(0);
  });
});
