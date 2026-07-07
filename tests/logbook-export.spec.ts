import { expect, describe, it } from "vitest";

import { SortieContext } from "../src/models/Logbook";
import { logbookExportFilename, toCSV, toDataUrl, toJSONL } from "../src/page/logbook/export";

// 出撃記録エクスポート機能のフォーマットルール。
const sortieFixture = (over: Record<string, unknown> = {}) =>
  ({
    _id: "sortie-1",
    started: new Date(2026, 6, 5, 12, 34, 0).getTime(),
    deck: "1",
    map: { area: 3, info: 2 },
    cells: [{ id: "1" }],
    battles: [
      { formation: "1", midnight: false },
      { formation: "2", midnight: true },
    ],
    ...over,
  }) as unknown as SortieContext;

describe("toCSV", () => {
  it("ヘッダー行と出撃記録一覧の表示列を出力する", () => {
    const csv = toCSV([sortieFixture()]);
    const [header, row] = csv.trimEnd().split("\r\n");
    expect(header).toBe("出撃日時,艦隊,海域,戦闘数,戦闘");
    expect(row).toBe("2026/7/5 12:34,1,3-2,2,単縦陣 / 複縦陣(夜)");
  });

  it("海域未確定の出撃は空欄にする", () => {
    const csv = toCSV([sortieFixture({ map: null })]);
    const [, row] = csv.trimEnd().split("\r\n");
    expect(row).toBe("2026/7/5 12:34,1,,2,単縦陣 / 複縦陣(夜)");
  });

  it("カンマや改行、ダブルクォートを含むフィールドはダブルクォートで囲みエスケープする", () => {
    const csv = toCSV([sortieFixture({ deck: '1,"艦隊"\n' })]);
    const [, row] = csv.trimEnd().split("\r\n");
    expect(row).toContain('"1,""艦隊""\n"');
  });
});

describe("toJSONL", () => {
  it("1行1出撃のJSONを、データ項目だけで出力する（battle メソッドは含めない）", () => {
    const jsonl = toJSONL([sortieFixture()]);
    const lines = jsonl.trimEnd().split("\n");
    expect(lines).toHaveLength(1);
    const parsed = JSON.parse(lines[0]);
    expect(parsed).toEqual({
      id: "sortie-1",
      started: sortieFixture().started,
      deck: "1",
      map: { area: 3, info: 2 },
      cells: [{ id: "1" }],
      battles: [
        { formation: "1", midnight: false },
        { formation: "2", midnight: true },
      ],
    });
    expect(parsed.battle).toBeUndefined();
  });

  it("複数の出撃記録を改行区切りで出力する", () => {
    const jsonl = toJSONL([sortieFixture({ _id: "a" }), sortieFixture({ _id: "b" })]);
    const lines = jsonl.trimEnd().split("\n");
    expect(lines.map((line) => JSON.parse(line).id)).toEqual(["a", "b"]);
  });
});

describe("logbookExportFilename", () => {
  it("拡張子とタイムスタンプ付きのファイル名を生成する", () => {
    const date = new Date(2026, 6, 5, 15, 30, 5);
    expect(logbookExportFilename("csv", date)).toBe("出撃記録_20260705_153005.csv");
    expect(logbookExportFilename("jsonl", date)).toBe("出撃記録_20260705_153005.jsonl");
  });
});

describe("toDataUrl", () => {
  it("MIMEタイプと URL エンコード済みの内容を持つ data URL を生成する", () => {
    const url = toDataUrl("あ,\n", "text/csv");
    expect(url).toBe(`data:text/csv;charset=utf-8,${encodeURIComponent("あ,\n")}`);
  });
});
