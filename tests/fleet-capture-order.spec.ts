import { expect, describe, it } from "vitest";

import { moveItem, nextOrder, sortByOrder } from "../src/models/capturePresetOrder";

// 編成キャプチャのプリセット並び順ロジックの検証。
// 一覧の並びと「編成キャプチャ画面を開いた直後にどれが選択されるか」がこの結果で決まる。

describe("sortByOrder", () => {
  it("order の昇順に並べ替える", () => {
    const items = [{ order: 2 }, { order: 0 }, { order: 1 }];
    expect(sortByOrder(items).map((item) => item.order)).toEqual([0, 1, 2]);
  });

  // order を保存していないレコードは既定値 0 に揃い、chrome.storage が返す ID の昇順
  // （基地航空隊が先頭）のまま並んでしまう。組み込みプリセットの既定順で解決する
  it("order が同値でも組み込みプリセットは既定の並び順になる", () => {
    const items = [
      { _id: "__aviation__", order: 0 },
      { _id: "__combined__", order: 0 },
      { _id: "__fleet__", order: 0 },
    ];
    expect(sortByOrder(items).map((item) => item._id)).toEqual([
      "__fleet__",
      "__combined__",
      "__aviation__",
    ]);
  });

  it("order が同値のとき組み込み以外は組み込みの後ろに元の並びで続く", () => {
    const items = [
      { _id: "abc", order: 0 },
      { _id: "__aviation__", order: 0 },
      { _id: "xyz", order: 0 },
    ];
    expect(sortByOrder(items).map((item) => item._id)).toEqual(["__aviation__", "abc", "xyz"]);
  });

  it("order が振られていれば組み込みの既定順より order を優先する", () => {
    const items = [
      { _id: "__fleet__", order: 2 },
      { _id: "__aviation__", order: 0 },
    ];
    expect(sortByOrder(items).map((item) => item._id)).toEqual(["__aviation__", "__fleet__"]);
  });

  it("組み込み以外どうしで order が同値なら元の並びを保つ", () => {
    const items = [
      { _id: "zzz", order: 0 },
      { _id: "aaa", order: 0 },
    ];
    expect(sortByOrder(items).map((item) => item._id)).toEqual(["zzz", "aaa"]);
  });

  it("元の配列を破壊しない", () => {
    const items = [{ order: 1 }, { order: 0 }];
    sortByOrder(items);
    expect(items.map((item) => item.order)).toEqual([1, 0]);
  });
});

describe("moveItem", () => {
  const items = ["a", "b", "c", "d"];

  it.each([
    { label: "先頭を末尾へ", from: 0, to: 3, expected: ["b", "c", "d", "a"] },
    { label: "末尾を先頭へ", from: 3, to: 0, expected: ["d", "a", "b", "c"] },
    { label: "ひとつ下へ", from: 1, to: 2, expected: ["a", "c", "b", "d"] },
    { label: "ひとつ上へ", from: 2, to: 1, expected: ["a", "c", "b", "d"] },
    { label: "同じ位置へ", from: 1, to: 1, expected: ["a", "b", "c", "d"] },
  ])("$label 移動できる", ({ from, to, expected }) => {
    expect(moveItem(items, from, to)).toEqual(expected);
  });

  it.each([
    { label: "移動元が範囲外", from: -1, to: 1 },
    { label: "移動先が範囲外", from: 0, to: 9 },
  ])("$label なら元の並びを返す", ({ from, to }) => {
    expect(moveItem(items, from, to)).toEqual(items);
  });

  it("元の配列を破壊しない", () => {
    moveItem(items, 0, 3);
    expect(items).toEqual(["a", "b", "c", "d"]);
  });
});

describe("nextOrder", () => {
  it("既存の最大値の次を返し、新規プリセットが末尾に並ぶ", () => {
    expect(nextOrder([{ order: 0 }, { order: 1 }, { order: 2 }])).toBe(3);
  });

  it("プリセットが1件も無ければ 0 を返す", () => {
    expect(nextOrder([])).toBe(0);
  });

  // 途中のプリセットを削除すると order は歯抜けになるが、最大値の次なら衝突しない
  it("order が歯抜けでも既存と重複しない値を返す", () => {
    expect(nextOrder([{ order: 0 }, { order: 5 }])).toBe(6);
  });
});

