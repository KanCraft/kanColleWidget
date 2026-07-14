import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

// FrameSettingView は Launcher/ScriptingService を直接 new するため、
// import より前にグローバル chrome をスタブする。
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: {
      id: "test",
      sendMessage: vi.fn().mockResolvedValue(undefined),
      onMessage: { addListener: () => {} },
    },
  };
});

import { FrameSettingView } from "../src/page/components/options/FrameSettingView";
import { Frame } from "../src/models/Frame";
import { GameWindowConfig } from "../src/models/configs/GameWindowConfig";

function renderView(frames: Frame[]) {
  const config = { alertBeforeClose: true } as GameWindowConfig;
  // FoldableSection は ?open=<id> が付いていると開いた状態で描画される
  const router = createMemoryRouter(
    [{ path: "/", element: <FrameSettingView frames={frames} config={config} /> }],
    { initialEntries: ["/?open=frames"] },
  );
  return render(<RouterProvider router={router} />);
}

// __memory__ の記憶（前回開いたウィンドウのサイズ）が肥大化・破損した際に、ユーザー自身が
// 手動で既定値へ戻せる導線（#1848）。アスペクト比等での自動判定は正規のカスタムサイズと
// 区別できないため採用せず、この能動的な操作だけが reset をトリガーする。
describe("FrameSettingView のウィンドウサイズリセット導線（#1848）", () => {
  beforeEach(() => {
    vi.mocked(chrome.runtime.sendMessage).mockClear();
  });

  it("__memory__ の行にだけ「ウィンドウサイズをリセット」ボタンを表示する", () => {
    const frames = [
      { _id: "__memory__", name: "MEMORY", protected: true } as Frame,
      { _id: "custom-1", name: "カスタム", protected: false } as Frame,
    ];
    renderView(frames);

    // 通常プリセット（custom-1）には表示されず、__memory__ にだけ表示される
    expect(screen.getAllByText("ウィンドウサイズをリセット")).toHaveLength(1);
  });

  it("クリックすると /frame/memory:reset を送信する", async () => {
    const frames = [{ _id: "__memory__", name: "MEMORY", protected: true } as Frame];
    renderView(frames);

    await userEvent.click(screen.getByText("ウィンドウサイズをリセット"));

    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith("test", { __action__: "/frame/memory:reset" });
  });
});
