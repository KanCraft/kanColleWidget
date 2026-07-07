import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

// ActionsView は Launcher 経由で chrome.tabs / chrome.windows を参照しうるため、
// import より前にグローバル chrome をスタブする。
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: {
      id: "test",
      sendMessage: vi.fn().mockResolvedValue({ opened: true, frame_id: null }),
      onMessage: { addListener: () => {} },
    },
  };
});

import { ActionsView } from "../src/page/components/dashboard/ActionsView";

function renderView(frameId: string, tab?: chrome.tabs.Tab) {
  const router = createMemoryRouter([
    { path: "/", element: <ActionsView tab={tab} frameId={frameId} /> },
  ]);
  return render(<RouterProvider router={router} />);
}

describe("ActionsView の錨アイコン", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ゲーム窓が無くても表示される", () => {
    renderView("__memory__");
    expect(screen.getByAltText("抜錨！")).toBeInTheDocument();
  });

  it("クリックすると /frame/open-or-focus を frameId 付きで送信する", async () => {
    renderView("__classic__");

    await userEvent.click(screen.getByAltText("抜錨！"));

    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith("test", {
      action: "/frame/open-or-focus",
      frame_id: "__classic__",
    });
  });
});
