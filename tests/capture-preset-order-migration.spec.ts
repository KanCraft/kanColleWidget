import { expect, describe, it, vi } from "vitest";

// Runtime が読み込む NotificationConfig は static default の初期化で
// chrome.runtime.getURL を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", getURL: (path: string) => `chrome-extension://test/${path}` },
  };
});

import { installMemoryStorage } from "jstorm/testing";

import { migrateCapturePresetOrder } from "../src/controllers/Runtime";

// order 導入以前に保存された CapturePreset には並び順が無く、chrome.storage が返す
// ID の昇順（基地航空隊が先頭）で一覧に並んでしまう。移行で既定の並び順が振られることを検証する。
describe("migrateCapturePresetOrder", () => {
  // 移行前の保存内容。chrome.storage の返し方に合わせて ID の昇順で並べている
  const legacyPresets = () => ({
    __aviation__: { _id: "__aviation__", name: "基地航空隊", protected: true },
    __combined__: { _id: "__combined__", name: "連合艦隊", protected: true },
    __fleet__: { _id: "__fleet__", name: "通常艦隊", protected: true },
  });

  const ordersOf = (table: unknown): Record<string, unknown> =>
    Object.fromEntries(
      Object.entries(table as Record<string, { order?: unknown }>).map(([id, record]) => [
        id,
        record.order,
      ]),
    );

  it("組み込みプリセットに既定の並び順を振り、通常艦隊を先頭にする", async () => {
    const area = installMemoryStorage({ CapturePreset: legacyPresets() });

    await migrateCapturePresetOrder(area);

    const stored = (await area.get("CapturePreset"))["CapturePreset"];
    expect(ordersOf(stored)).toEqual({ __fleet__: 0, __combined__: 1, __aviation__: 2 });
  });

  it("移行してもプリセットの中身は変わらない", async () => {
    const area = installMemoryStorage({ CapturePreset: legacyPresets() });

    await migrateCapturePresetOrder(area);

    const stored = (await area.get("CapturePreset"))["CapturePreset"] as Record<string, unknown>;
    expect(stored["__fleet__"]).toEqual({
      _id: "__fleet__",
      name: "通常艦隊",
      protected: true,
      order: 0,
    });
  });

  it("自作プリセットは組み込みプリセットの後ろに並ぶ", async () => {
    const area = installMemoryStorage({
      CapturePreset: {
        ...legacyPresets(),
        abc: { _id: "abc", name: "わたしの編成", protected: false },
        xyz: { _id: "xyz", name: "べつの編成", protected: false },
      },
    });

    await migrateCapturePresetOrder(area);

    const stored = (await area.get("CapturePreset"))["CapturePreset"];
    expect(ordersOf(stored)).toEqual({
      __fleet__: 0,
      __combined__: 1,
      __aviation__: 2,
      abc: 3,
      xyz: 4,
    });
  });

  // 並び替え済みのユーザーの順序を移行で巻き戻さない
  it("すべてのレコードが order を持っていれば何もしない", async () => {
    const area = installMemoryStorage({
      CapturePreset: {
        __aviation__: { _id: "__aviation__", order: 0 },
        __fleet__: { _id: "__fleet__", order: 1 },
      },
    });
    const before = await area.get(null);

    await migrateCapturePresetOrder(area);

    expect(await area.get(null)).toEqual(before);
  });

  it("一部のレコードにしか order が無ければ全件を振り直す", async () => {
    const area = installMemoryStorage({
      CapturePreset: {
        ...legacyPresets(),
        zzz: { _id: "zzz", name: "移行前に作った編成", order: 1 },
      },
    });

    await migrateCapturePresetOrder(area);

    const stored = (await area.get("CapturePreset"))["CapturePreset"];
    expect(ordersOf(stored)).toEqual({ __fleet__: 0, __combined__: 1, __aviation__: 2, zzz: 3 });
  });

  it.each([
    { label: "プリセットが保存されていない", initial: { Queue: { "1": { type: "mission" } } } },
    { label: "空のテーブルしかない", initial: { CapturePreset: {} } },
    { label: "オブジェクト以外が入っている", initial: { CapturePreset: "not-a-table" } },
  ])("$label ときは何もしない", async ({ initial }) => {
    const area = installMemoryStorage(initial);
    const before = await area.get(null);

    await migrateCapturePresetOrder(area);

    expect(await area.get(null)).toEqual(before);
  });
});
