import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

// chromite（logger 経由）はモジュール読み込み時に chrome.runtime を、NotificationConfig
// （loader 経由）は static default の初期化で chrome.runtime.getURL を参照するため、
// import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: {
      id: "test",
      onMessage: { addListener: () => {} },
      getURL: (path: string) => `chrome-extension://test/${path}`,
    },
  };

  // react-router のローダー実行は new Request(url, { signal }) を生成するが、
  // node(undici) の Request は jsdom の AbortSignal をブランドチェックで拒否する。
  // ローダー呼び出しで参照されるのは url / method / signal 程度なので、最小互換クラスに差し替える。
  class LoaderRequest {
    public url: string;
    public method: string;
    public signal?: AbortSignal;
    public headers = new Map<string, string>();
    constructor(url: string | URL, init: { signal?: AbortSignal; method?: string } = {}) {
      this.url = String(url);
      this.method = init.method ?? "GET";
      this.signal = init.signal;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).Request = LoaderRequest;
});

// ゲームウィンドウ検出（chrome API）はテスト環境に無いためモックする。
// プレビューは「ウィンドウ未検出」経路に固定し、プリセット操作とグリッド編集の検証に集中する。
vi.mock("../src/services/Launcher", () => ({
  Launcher: class {
    async find() {
      return null;
    }
  },
}));

import { FleetCapturePage } from "../src/page/fleet-capture/FleetCapturePage";
import { fleetcapture } from "../src/page/loader";
import { CapturePreset } from "../src/models/CapturePreset";
import { restoreDefaultsBeforeEach } from "./helpers/jstorm-defaults";

function renderPage() {
  const router = createMemoryRouter([
    { path: "/", element: <FleetCapturePage />, loader: fleetcapture },
  ]);
  return render(<RouterProvider router={router} />);
}

// キャプチャモードから調整モードへ切り替える
async function openAdjustMode() {
  await userEvent.click(screen.getByRole("button", { name: "切り抜き範囲を調整する" }));
}

restoreDefaultsBeforeEach(CapturePreset);

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe("FleetCapturePage", () => {
  it("組み込みプリセットが選択肢に並び、初期状態では通常艦隊のグリッドが表示される", async () => {
    renderPage();
    expect(await screen.findByRole("option", { name: "通常艦隊" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "連合艦隊" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "基地航空隊" })).toBeInTheDocument();
    // 通常艦隊の6セルが未撮影ボタンとして並ぶ
    ["旗艦", "第二艦", "第三艦", "第四艦", "第五艦", "第六艦"].forEach((label) => {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    });
  });

  it("連合艦隊を選ぶと3行4列のグリッドになる", async () => {
    renderPage();
    await screen.findByRole("option", { name: "連合艦隊" });
    await userEvent.selectOptions(screen.getByRole("combobox"), "__combined__");
    expect(screen.getByRole("button", { name: "第一艦隊 旗艦" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "第二艦隊 旗艦" })).toBeInTheDocument();
    // 第二艦〜第六艦は第一・第二艦隊の2列ずつ存在する
    expect(screen.getAllByRole("button", { name: "第二艦" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "第六艦" })).toHaveLength(2);
  });

  it("調整モードとキャプチャモードが切り替え表示される", async () => {
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    // 初期はキャプチャモード（調整UIなし）
    expect(screen.queryByLabelText("左位置")).not.toBeInTheDocument();
    await openAdjustMode();
    // 調整モードではグリッドが隠れて調整UIとプリセット操作ボタンが出る
    expect(screen.getByLabelText("左位置")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "名前を付けて保存" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "旗艦" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "キャプチャに戻る" }));
    expect(screen.getByRole("button", { name: "旗艦" })).toBeInTheDocument();
  });

  it("組み込みプリセット選択中は「更新」「削除」が無効で「名前を付けて保存」だけ有効", async () => {
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    await openAdjustMode();
    expect(screen.getByRole("button", { name: "プリセットを更新" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "プリセットを削除" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "名前を付けて保存" })).toBeEnabled();
  });

  it("行数を増やすと新しいセルに「行-列」形式のラベルが付く", async () => {
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    await openAdjustMode();
    fireEvent.change(screen.getByLabelText("行数"), { target: { value: "4" } });
    await userEvent.click(screen.getByRole("button", { name: "キャプチャに戻る" }));
    expect(screen.getByRole("button", { name: "4-1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4-2" })).toBeInTheDocument();
    // 既存セルのラベルは保持される
    expect(screen.getByRole("button", { name: "旗艦" })).toBeInTheDocument();
  });

  it("範囲を変更して「名前を付けて保存」すると新プリセットが作られ、選択・編集可能になる", async () => {
    vi.stubGlobal("prompt", vi.fn().mockReturnValue("マイ範囲"));
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    await openAdjustMode();
    fireEvent.change(screen.getByLabelText("左位置"), { target: { value: "10" } });
    await userEvent.click(screen.getByRole("button", { name: "名前を付けて保存" }));

    expect(await screen.findByRole("option", { name: "マイ範囲" })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "プリセットを削除" })).toBeEnabled();
    });
    // ストレージにも永続化されている（組み込み3件＋新規1件）
    const saved = await CapturePreset.list();
    expect(saved).toHaveLength(4);
    const created = saved.find((preset) => preset.name === "マイ範囲")!;
    expect(created.rect.x).toBeCloseTo(0.1);
    expect(created.protected).toBe(false);
  });

  it("自作プリセットを削除すると組み込みプリセットの選択に戻る", async () => {
    vi.stubGlobal("prompt", vi.fn().mockReturnValue("消すやつ"));
    vi.stubGlobal("confirm", vi.fn().mockReturnValue(true));
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    await openAdjustMode();
    await userEvent.click(screen.getByRole("button", { name: "名前を付けて保存" }));
    await screen.findByRole("option", { name: "消すやつ" });

    await userEvent.click(screen.getByRole("button", { name: "プリセットを削除" }));
    await waitFor(() => {
      expect(screen.queryByRole("option", { name: "消すやつ" })).not.toBeInTheDocument();
    });
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("__fleet__");
    expect(await CapturePreset.list()).toHaveLength(3);
  });

  it("ゲームウィンドウが見つからないときはプレビューに案内を表示する", async () => {
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    await openAdjustMode();
    expect(
      await screen.findByText(/ゲームウィンドウが見つかりません/),
    ).toBeInTheDocument();
  });
});
