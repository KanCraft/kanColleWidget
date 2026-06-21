import { expect, describe, it, vi } from "vitest";

// jstorm/chrome/local の Model は import 時に chrome.storage.local を静的参照するため、
// import より前に chrome を最小スタブする。本テストは battles 配列の操作のみ検証する。
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} } },
    storage: { local: { get: () => {}, set: () => {} } },
  };
});

import { SortieContext } from "../src/models/Logbook";

// 連戦数は「マス数」ではなく「戦闘回数」で数える（#1764）。各 WebRequest ハンドラが
// SortieContext.battle に対して行う操作の不変条件を固定する。
describe("SortieContext 連戦数カウント", () => {
  it("battle.start で1戦ぶん push され、初期状態は非夜戦", () => {
    const ctx = new SortieContext();
    ctx.battle.start("1");
    expect(ctx.battles.length).toBe(1);
    expect(ctx.battles[0].midnight).toBe(false);
  });

  it("開幕夜戦マス(sp_midnight)相当: start+midnight で新規戦闘として算入し夜戦フラグが立つ", () => {
    const ctx = new SortieContext();
    ctx.battle.start("1"); // 昼戦マス
    ctx.battle.start("1"); // 開幕夜戦マス（新規 push）
    ctx.battle.midnight(); // 夜戦フラグ
    expect(ctx.battles.length).toBe(2);
    expect(ctx.battles[1].midnight).toBe(true);
  });

  it("追撃夜戦(/battle)相当: midnight 単独では push されず、最後の戦闘にフラグだけ立つ", () => {
    const ctx = new SortieContext();
    ctx.battle.start("1"); // 昼戦
    ctx.battle.midnight(); // 同マスの追撃夜戦
    expect(ctx.battles.length).toBe(1); // マス数ではなく戦闘回数なので増えない
    expect(ctx.battles[0].midnight).toBe(true);
  });

  it("非戦闘マス(next のみ)は battle が呼ばれないので連戦数に影響しない", () => {
    const ctx = new SortieContext();
    ctx.battle.start("1"); // 昼戦
    ctx.next("12");        // 非戦闘マスを通過
    ctx.battle.start("1"); // 次の戦闘
    expect(ctx.battles.length).toBe(2); // next は数えない
  });

  it("昼→開幕夜戦×2→昼 の 5-4 実データ相当で連戦数 4 になる", () => {
    const ctx = new SortieContext();
    ctx.battle.start("1");                       // 昼戦
    ctx.battle.start("1"); ctx.battle.midnight(); // 開幕夜戦1
    ctx.battle.start("1"); ctx.battle.midnight(); // 開幕夜戦2
    ctx.battle.start("1");                       // ボス昼戦
    expect(ctx.battles.length).toBe(4);
    expect(ctx.battles.filter((b) => b.midnight).length).toBe(2);
  });

  it("前出撃の戦闘が残った状態で start() すると連戦数が 0 にリセットされる(#1367)", () => {
    const ctx = new SortieContext();
    // 前の出撃で戦闘・マス移動が記録された状態を作る
    ctx.next("1");
    ctx.battle.start("1");
    ctx.battle.start("1");
    expect(ctx.battles.length).toBe(2);
    expect(ctx.cells.length).toBe(1);
    // 母港(/api_port/port)を挟まず次の出撃が始まっても、新規出撃は連戦数 0 から始まる
    ctx.start("2", { area: "2", info: "2" });
    expect(ctx.battles.length).toBe(0);
    expect(ctx.cells.length).toBe(0);
    // 初手の戦闘で連戦数は 1 から始まる
    ctx.battle.start("1");
    expect(ctx.battles.length).toBe(1);
  });
});
