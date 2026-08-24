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

// 畳まれている切り抜き範囲の調整を開く
async function openRangeAdjuster() {
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

  // 初期選択は並び順の先頭。オプション画面でプリセットを並べ替えるとここに反映される
  it("並び順の先頭のプリセットが初期選択になる", async () => {
    CapturePreset.default.__aviation__.order = 0;
    CapturePreset.default.__fleet__.order = 2;
    renderPage();
    await screen.findByRole("option", { name: "基地航空隊" });
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("__aviation__");
    expect(screen.getByRole("button", { name: "第一航空隊" })).toBeInTheDocument();
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

  // 調整を開いてもグリッドが視界から消えないことが、この画面を1枚にまとめた狙い
  it("切り抜き範囲の調整は開閉でき、開いている間もグリッドは見えたまま", async () => {
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    const toggle = screen.getByRole("button", { name: "切り抜き範囲を調整する" });
    // 既定では畳まれている
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByLabelText("左位置")).not.toBeInTheDocument();

    await openRangeAdjuster();
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByLabelText("左位置")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "旗艦" })).toBeInTheDocument();

    await userEvent.click(toggle);
    expect(screen.queryByLabelText("左位置")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "旗艦" })).toBeInTheDocument();
  });

  // 組み込みプリセットは上書きできないため、変更の受け皿は「名前を付けて保存」だけになる
  it("組み込みプリセット選択中は「更新」が無効のまま、その理由を添える", async () => {
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    expect(screen.getByRole("button", { name: "プリセットを更新" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "名前を付けて保存" })).toBeEnabled();
    expect(screen.getByText("組み込みプリセットは上書きできません")).toBeInTheDocument();

    // 変更しても組み込みプリセットには上書きできない
    fireEvent.change(screen.getByLabelText("行数"), { target: { value: "4" } });
    expect(screen.getByRole("button", { name: "プリセットを更新" })).toBeDisabled();
  });

  it("行数は調整を開かずに変更でき、増えたセルには「行-列」形式のラベルが付く", async () => {
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    fireEvent.change(screen.getByLabelText("行数"), { target: { value: "4" } });
    expect(screen.getByRole("button", { name: "4-1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4-2" })).toBeInTheDocument();
    // 既存セルのラベルは保持される
    expect(screen.getByRole("button", { name: "旗艦" })).toBeInTheDocument();
  });

  it("範囲を変更して「名前を付けて保存」すると新プリセットが作られ、それが選択される", async () => {
    vi.stubGlobal("prompt", vi.fn().mockReturnValue("マイ範囲"));
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    await openRangeAdjuster();
    fireEvent.change(screen.getByLabelText("左位置"), { target: { value: "10" } });
    await userEvent.click(screen.getByRole("button", { name: "名前を付けて保存" }));

    expect(await screen.findByRole("option", { name: "マイ範囲" })).toBeInTheDocument();
    await waitFor(() => {
      expect((screen.getByRole("combobox") as HTMLSelectElement).selectedOptions[0].textContent)
        .toBe("マイ範囲");
    });
    // ストレージにも永続化されている（組み込み3件＋新規1件）
    const saved = await CapturePreset.list();
    expect(saved).toHaveLength(4);
    const created = saved.find((preset) => preset.name === "マイ範囲")!;
    expect(created.rect.x).toBeCloseTo(0.1);
    expect(created.protected).toBe(false);
  });

  // chrome.storage は保存したオブジェクトのキーを並べ替えて返すため、保存済みプリセットの
  // rect は編集中の値と違うキー順で読み出される。文字列化して比べていた頃は、値を戻しても
  // 「変更あり」が消えなかった
  it("値を変えてから元に戻すと変更ありの表示が消える", async () => {
    CapturePreset.default.__fleet__.protected = false;
    CapturePreset.default.__fleet__.rect = { h: 0.78, w: 0.6, x: 0.39, y: 0.2 };
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    await openRangeAdjuster();

    fireEvent.change(screen.getByLabelText("左位置"), { target: { value: "10" } });
    expect(screen.getByText("変更あり")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "プリセットを更新" })).toBeEnabled();

    fireEvent.change(screen.getByLabelText("左位置"), { target: { value: "39" } });
    expect(screen.queryByText("変更あり")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "プリセットを更新" })).toBeDisabled();
  });

  it("プリセットを保存すると保存できた旨を知らせる", async () => {
    vi.stubGlobal("prompt", vi.fn().mockReturnValue("マイ編成"));
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    // 組み込みプリセットは上書きできないため、まず自作プリセットを作る
    fireEvent.change(screen.getByLabelText("行数"), { target: { value: "4" } });
    await userEvent.click(screen.getByRole("button", { name: "名前を付けて保存" }));
    expect(await screen.findByText("「マイ編成」を保存しました")).toBeInTheDocument();
    await screen.findByRole("option", { name: "マイ編成" });

    fireEvent.change(screen.getByLabelText("行数"), { target: { value: "5" } });
    await userEvent.click(screen.getByRole("button", { name: "プリセットを更新" }));
    expect(await screen.findByText("「マイ編成」に保存しました")).toBeInTheDocument();
    // 保存した内容が編集中の値と一致するので、更新ボタンは押せない状態に戻る
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "プリセットを更新" })).toBeDisabled();
    });
  });

  it("「名前を付けて保存」したプリセットは選択肢の末尾に並ぶ", async () => {
    vi.stubGlobal("prompt", vi.fn().mockReturnValue("あとから足した編成"));
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    fireEvent.change(screen.getByLabelText("行数"), { target: { value: "4" } });
    await userEvent.click(screen.getByRole("button", { name: "名前を付けて保存" }));

    await screen.findByRole("option", { name: "あとから足した編成" });
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
      "通常艦隊",
      "連合艦隊",
      "基地航空隊",
      "あとから足した編成",
    ]);
  });

  // プリセットの削除はオプション画面に集約しているため、この画面には削除の導線を持たない
  it("プリセットを削除するボタンは置かない", async () => {
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    await openRangeAdjuster();
    expect(screen.queryByRole("button", { name: "プリセットを削除" })).not.toBeInTheDocument();
  });

  it("ゲームウィンドウが見つからないときはプレビューに案内を表示する", async () => {
    renderPage();
    await screen.findByRole("option", { name: "通常艦隊" });
    expect(
      await screen.findByText(/ゲームウィンドウが見つかりません/),
    ).toBeInTheDocument();
  });
});
