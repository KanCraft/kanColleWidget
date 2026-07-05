import { expect, describe, it } from "vitest";

import { SortieContext } from "../src/models/Logbook";
import { describeBattles, formationName, formatStarted } from "../src/page/logbook/format";

// 出撃記録一覧の表示整形ルール。
describe("formationName", () => {
  it.each([
    ["1", "単縦陣"],
    ["2", "複縦陣"],
    ["3", "輪形陣"],
    ["4", "梯形陣"],
    ["5", "単横陣"],
    ["6", "警戒陣"],
    ["11", "第一警戒航行序列"],
    ["14", "第四警戒航行序列"],
  ])("陣形コード %s は %s と表示する", (code, name) => {
    expect(formationName(code)).toBe(name);
  });

  it("未知のコードはコードのまま表示する", () => {
    expect(formationName("99")).toBe("99");
  });

  it("空文字は「不明」と表示する", () => {
    expect(formationName("")).toBe("不明");
  });
});

describe("formatStarted", () => {
  it("出撃日時を 年/月/日 時:分 で表示する", () => {
    const started = new Date(2026, 6, 5, 12, 34, 56).getTime();
    expect(formatStarted(started)).toBe("2026/7/5 12:34");
  });
});

describe("describeBattles", () => {
  const sortieWith = (battles: Array<{ formation: string; midnight: boolean }>) =>
    ({ battles }) as unknown as SortieContext;

  it("戦闘ごとの陣形を順に列挙し、夜戦があった戦闘には (夜) を付ける", () => {
    const sortie = sortieWith([
      { formation: "1", midnight: false },
      { formation: "2", midnight: true },
      { formation: "1", midnight: false },
    ]);
    expect(describeBattles(sortie)).toBe("単縦陣 / 複縦陣(夜) / 単縦陣");
  });

  it("戦闘がなければ空文字を返す", () => {
    expect(describeBattles(sortieWith([]))).toBe("");
  });
});
