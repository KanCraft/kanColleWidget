import { expect, describe, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

// chromite（logger 経由で import される）はモジュール読み込み時に chrome.runtime を参照するため、
// import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = { runtime: { id: "test", onMessage: { addListener: () => {} } } };

  // 並び替えの保存後に呼ぶ revalidate は new Request(url, { signal }) を生成するが、
  // node(undici) の Request は jsdom の AbortSignal をブランドチェックで拒否する。
  // 参照されるのは url / method / signal 程度なので、最小互換クラスに差し替える。
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

// 「編成キャプチャ画面を開く」ボタンが参照する chrome API はテスト環境に無いためモックする
vi.mock("../src/services/Launcher", () => ({
  Launcher: class {
    static async fleetcapture() {
      return null;
    }
  },
}));

import { Model } from "jstorm/chrome/local";
import { installMemoryStorage } from "jstorm/testing";

import { FleetCaptureSettingView } from "../src/page/components/options/FleetCaptureSettingView";
import { CapturePreset } from "../src/models/CapturePreset";
import { sortByOrder } from "../src/models/capturePresetOrder";
import { FleetCaptureConfig, TransparentBackground } from "../src/models/configs/FleetCaptureConfig";
import { restoreDefaultsBeforeEach } from "./helpers/jstorm-defaults";

restoreDefaultsBeforeEach(FleetCaptureConfig, CapturePreset);

async function renderView() {
  // 画面は loader と同じく並び順を解決した一覧を受け取る
  const presets = sortByOrder(await CapturePreset.list());
  const config = await FleetCaptureConfig.user();
  // FoldableSection は ?open=<id> が付いていると開いた状態で描画される
  const router = createMemoryRouter(
    [{ path: "/", element: <FleetCaptureSettingView presets={presets} config={config} /> }],
    { initialEntries: ["/?open=fleet-capture"] },
  );
  render(<RouterProvider router={router} />);
}

// 一覧に並んでいるプリセット名（ドラッグ中は仮の並びが返る）
const presetNames = () =>
  screen.getAllByRole("listitem").map((row) => row.querySelector("h4")?.textContent);

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

  it("プリセットは並び順どおりに一覧表示される", async () => {
    await renderView();
    expect(presetNames()).toEqual(["通常艦隊", "連合艦隊", "基地航空隊"]);
  });

  // 落とす前に結果の並びを見せることで、どこに入るかを枠線の色に頼らず伝える
  it("ドラッグ中は落とした結果の並びを表示するが、まだ保存はしない", async () => {
    await renderView();
    const rows = screen.getAllByRole("listitem");
    fireEvent.dragStart(rows[0]);
    fireEvent.dragOver(rows[2]);

    expect(presetNames()).toEqual(["連合艦隊", "基地航空隊", "通常艦隊"]);
    const saved = sortByOrder(await CapturePreset.list());
    expect(saved.map((preset) => preset.name)).toEqual(["通常艦隊", "連合艦隊", "基地航空隊"]);
  });

  it("ドラッグを中断すると元の並びに戻る", async () => {
    await renderView();
    const rows = screen.getAllByRole("listitem");
    fireEvent.dragStart(rows[0]);
    fireEvent.dragOver(rows[2]);
    fireEvent.dragEnd(rows[0]);

    expect(presetNames()).toEqual(["通常艦隊", "連合艦隊", "基地航空隊"]);
  });

  it("行をドラッグして別の行に落とすと新しい並び順が保存される", async () => {
    await renderView();
    const rows = screen.getAllByRole("listitem");
    // 先頭の「通常艦隊」を末尾の「基地航空隊」の位置へ移動する
    fireEvent.dragStart(rows[0]);
    fireEvent.dragOver(rows[2]);
    fireEvent.drop(rows[2]);

    await waitFor(async () => {
      const saved = sortByOrder(await CapturePreset.list());
      expect(saved.map((preset) => preset.name)).toEqual(["連合艦隊", "基地航空隊", "通常艦隊"]);
    });
  });

  // order 導入以前に保存されたプリセットは並び順を持たない。並べ替えでは差分ではなく
  // 全件を保存し、そうしたレコードにも order が書き込まれることを検証する
  it("並び順を保存していないプリセットも並べ替えで order が書き込まれる", async () => {
    const area = installMemoryStorage({
      CapturePreset: {
        __aviation__: { _id: "__aviation__", name: "基地航空隊", protected: true },
        __combined__: { _id: "__combined__", name: "連合艦隊", protected: true },
        __fleet__: { _id: "__fleet__", name: "通常艦隊", protected: true },
      },
    });
    Model.useStorage(area);
    await renderView();

    const rows = screen.getAllByRole("listitem");
    fireEvent.dragStart(rows[0]);
    fireEvent.dragOver(rows[1]);
    fireEvent.drop(rows[1]);

    await waitFor(async () => {
      const stored = (await area.get("CapturePreset"))["CapturePreset"] as Record<
        string,
        { order?: unknown }
      >;
      expect(Object.values(stored).map((record) => record.order).sort()).toEqual([0, 1, 2]);
    });
  });

  it("同じ行に落としたときは並び順を変えない", async () => {
    await renderView();
    const rows = screen.getAllByRole("listitem");
    fireEvent.dragStart(rows[1]);
    fireEvent.dragOver(rows[1]);
    fireEvent.drop(rows[1]);

    const saved = sortByOrder(await CapturePreset.list());
    expect(saved.map((preset) => preset.name)).toEqual(["通常艦隊", "連合艦隊", "基地航空隊"]);
  });

  it("「透明にする」をチェックすると背景色設定が transparent で保存される", async () => {
    await renderView();
    await userEvent.click(screen.getByRole("checkbox", { name: /透明にする/ }));
    const updated = await FleetCaptureConfig.user();
    expect(updated.background).toBe(TransparentBackground);
  });
});
