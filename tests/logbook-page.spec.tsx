import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

import { LogbookPage } from "../src/page/logbook/LogbookPage";

// LogbookPage を loader データ付きで単体レンダリングする。
// loader の非同期初期化を待たずに済むよう、hydrationData で初期データを与える。
const renderPage = (sorties: unknown[]) => {
  const router = createMemoryRouter(
    [{ id: "logbook", path: "/", element: <LogbookPage />, loader: () => ({ sorties }) }],
    { hydrationData: { loaderData: { logbook: { sorties } } } },
  );
  return render(<RouterProvider router={router} />);
};

let seq = 0;
const sortie = (over: Record<string, unknown> = {}) => ({
  _id: `sortie-${seq++}`,
  started: new Date(2026, 6, 5, 12, 0).getTime(),
  map: { area: 3, info: 2 },
  deck: "1",
  battles: [],
  ...over,
});

describe("LogbookPage", () => {
  it("出撃記録がなければその旨を表示する", async () => {
    renderPage([]);
    expect(await screen.findByText("出撃記録がありません")).toBeInTheDocument();
  });

  it("更新ボタンと自動更新トグル（既定オフ）を表示する", async () => {
    renderPage([]);
    expect(await screen.findByText("更新")).toBeInTheDocument();
    const toggle = screen.getByRole("checkbox");
    expect(toggle).not.toBeChecked();
  });

  it("新しい出撃が上の行に来る", async () => {
    renderPage([
      sortie({ started: new Date(2026, 6, 5, 10, 0).getTime(), map: { area: 3, info: 2 } }),
      sortie({ started: new Date(2026, 6, 5, 11, 0).getTime(), map: { area: 5, info: 1 } }),
    ]);
    const rows = await screen.findAllByRole("row");
    // rows[0] はヘッダ行
    expect(rows[1].textContent).toContain("5-1");
    expect(rows[2].textContent).toContain("3-2");
  });

  it("戦闘列に陣形名と夜戦有無を表示する", async () => {
    renderPage([
      sortie({
        battles: [
          { formation: "1", midnight: false },
          { formation: "2", midnight: true },
        ],
      }),
    ]);
    expect(await screen.findByText("単縦陣 / 複縦陣(夜)")).toBeInTheDocument();
    expect(screen.getByText("2戦")).toBeInTheDocument();
  });
});
