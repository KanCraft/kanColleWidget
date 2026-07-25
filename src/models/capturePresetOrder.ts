// 編成キャプチャのプリセット並び順を扱うロジック。
// loader (src/page/**) は coverage 除外なので、テスト可能な純粋関数としてここに切り出している。

import { CapturePreset } from "./CapturePreset";

// 並び順を持つレコード
interface Ordered {
  _id?: string | null;
  order: number;
}

// 組み込みプリセットの既定の並び順を引く。組み込み以外は末尾に回す
function builtinRank(item: Ordered): number {
  const builtins: Record<string, { order: number }> = CapturePreset.default;
  const builtin = item._id ? builtins[item._id] : undefined;
  return builtin ? builtin.order : Number.MAX_SAFE_INTEGER;
}

/**
 * order の昇順に並べ替えた新しい配列を返す。
 *
 * order を保存していないレコードは既定値 0 に揃ってしまい、chrome.storage が返す
 * ID の昇順（基地航空隊が先頭）がそのまま一覧の並びになる。そのため order が同値の
 * ときは組み込みプリセットの既定順で解決し、組み込み以外は元の並びのまま後ろへ送る。
 */
export function sortByOrder<T extends Ordered>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order || builtinRank(a) - builtinRank(b));
}

/**
 * 配列の要素を from の位置から to の位置へ移動した新しい配列を返す。
 * 範囲外の添字を渡された場合は元の並びをそのまま返す。
 */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (!isValidIndex(items, from) || !isValidIndex(items, to)) return [...items];
  const moved = [...items];
  const [target] = moved.splice(from, 1);
  moved.splice(to, 0, target);
  return moved;
}

/**
 * 新規に追加するレコードへ与える order を返す。
 * 既存の最大値の次を割り当てることで、追加したものが常に一覧の末尾に並ぶ。
 */
export function nextOrder(items: Ordered[]): number {
  return items.reduce((max, item) => Math.max(max, item.order), -1) + 1;
}

function isValidIndex(items: unknown[], index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < items.length;
}
