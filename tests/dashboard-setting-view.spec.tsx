import { expect, describe, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

import { DashboardSettingView } from "../src/page/components/options/DashboardSettingView";
import { DashboardConfig } from "../src/models/configs/DashboardConfig";
import { restoreDefaultsBeforeEach } from "./helpers/jstorm-defaults";

restoreDefaultsBeforeEach(DashboardConfig);

async function renderView() {
  const config = await DashboardConfig.user();
  // FoldableSection は ?open=<id> が付いていると開いた状態で描画される
  const router = createMemoryRouter(
    [{ path: "/", element: <DashboardSettingView config={config} /> }],
    { initialEntries: ["/?open=dashboard"] },
  );
  render(<RouterProvider router={router} />);
}

// 横幅・縦幅・左位置・上位置の入力欄を空にしたときの回帰テスト。
// 以前は parseInt(e.target.value, 10) の戻り値を無ガードで保存しており、
// 入力欄を空にした瞬間 NaN が chrome.storage に保存されるバグがあった（0px窓になり得る）。
describe("DashboardSettingView 数値欄のNaN保存バグ回帰", () => {
  it("横幅入力を空にしても DashboardConfig.width は NaN にならず既定値(600)が保存される", async () => {
    await renderView();
    const input = screen.getByPlaceholderText("600");
    await userEvent.clear(input);

    const reloaded = await DashboardConfig.user();
    expect(reloaded.width).not.toBeNaN();
    expect(reloaded.width).toBe(600);
    // 入力欄の表示にも既定値が即座に反映される
    expect(input).toHaveValue(600);
  });

  it("縦幅入力を空にしても DashboardConfig.height は NaN にならず既定値(400)が保存される", async () => {
    await renderView();
    const input = screen.getByPlaceholderText("400");
    await userEvent.clear(input);

    const reloaded = await DashboardConfig.user();
    expect(reloaded.height).not.toBeNaN();
    expect(reloaded.height).toBe(400);
  });

  it("数値を入力すればその値がそのまま保存される", async () => {
    await renderView();
    const input = screen.getByPlaceholderText("600");
    fireEvent.change(input, { target: { value: "800" } });

    const reloaded = await DashboardConfig.user();
    expect(reloaded.width).toBe(800);
  });
});
