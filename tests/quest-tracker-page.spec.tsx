import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

// QuestTrackerList が chrome.storage.onChanged を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    storage: { onChanged: { addListener: vi.fn(), removeListener: vi.fn() } },
  };
});

import { QuestTrackerPage } from "../src/page/quest-tracker/QuestTrackerPage";
import { QuestProgress } from "../src/models/QuestProgress";

// jstorm はストレージが空の間 static default オブジェクトをそのまま返し、update() はそのオブジェクトへ
// 書き込む。テスト間の汚染を防ぐため毎回復元する。
const pristineDefaults = structuredClone(QuestProgress.default);
beforeEach(() => {
  QuestProgress.default = structuredClone(pristineDefaults);
});

// QuestTrackerPage を loader データ付きで単体レンダリングする。
// loader の非同期初期化を待たずに済むよう、hydrationData で初期データを与える。
const renderPage = async () => {
  const progress = await QuestProgress.user();
  const router = createMemoryRouter(
    [{ id: "quest-tracker", path: "/", element: <QuestTrackerPage />, loader: () => ({ progress }) }],
    { hydrationData: { loaderData: { "quest-tracker": { progress } } } },
  );
  return render(<RouterProvider router={router} />);
};

describe("QuestTrackerPage", () => {
  it("見出しと更新ボタンを表示する", async () => {
    await renderPage();
    expect(await screen.findByText("任務トラッカー")).toBeInTheDocument();
    expect(screen.getByText("更新")).toBeInTheDocument();
  });

  it("QuestProgressの内容を一覧表示する", async () => {
    await renderPage();
    expect(await screen.findByText("「演習」で練度向上！")).toBeInTheDocument();
  });
});
