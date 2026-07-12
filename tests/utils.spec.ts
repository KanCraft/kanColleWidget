import { expect, describe, it } from "vitest";

import { KCWDate, parseHMS } from "../src/utils";

describe("format", () => {
  it("should format date correctly", () => {
    const date = new KCWDate("August 25, 2024 07:00:00");
    expect(date.format("YYYY/mm/dd HH:MM:SS")).toBe("2024/08/25 07:00:00");
  });
});

describe("ETA", () => {
  it("should calculate ETA correctly", () => {
    const date = new KCWDate("August 25, 2024 07:00:00");
    const eta = KCWDate.ETA(1000 * 60 * 60, date.getTime());
    expect(eta.format("YYYY/mm/dd HH:MM:SS")).toBe("2024/08/25 08:00:00");
  });
});

// デイリーリセットは朝5時。それより前は前日として扱う
describe("isSameKCDay", () => {
  it("同日の朝5時以降は同じ艦これ日", () => {
    const a = new KCWDate("August 25, 2024 05:00:00").getTime();
    const b = new KCWDate("August 25, 2024 23:59:59").getTime();
    expect(KCWDate.isSameKCDay(a, b)).toBe(true);
  });

  it("日付が変わっても朝5時より前は前日の続き扱い", () => {
    const beforeReset = new KCWDate("August 26, 2024 04:59:59").getTime();
    const previousDay = new KCWDate("August 25, 2024 12:00:00").getTime();
    expect(KCWDate.isSameKCDay(beforeReset, previousDay)).toBe(true);
  });

  it("朝5時ちょうどを跨ぐと別の艦これ日になる", () => {
    const beforeReset = new KCWDate("August 26, 2024 04:59:59").getTime();
    const afterReset = new KCWDate("August 26, 2024 05:00:00").getTime();
    expect(KCWDate.isSameKCDay(beforeReset, afterReset)).toBe(false);
  });
});

describe("dayOfMonth", () => {
  it("朝5時以降はその日の日付を返す", () => {
    const epoch = new KCWDate("August 7, 2024 05:00:00").getTime();
    expect(KCWDate.dayOfMonth(epoch)).toBe(7);
  });

  it("朝5時より前は前日の日付を返す", () => {
    const epoch = new KCWDate("August 8, 2024 04:59:59").getTime();
    expect(KCWDate.dayOfMonth(epoch)).toBe(7);
  });
});

describe("parseHMS", () => {
  it("h:m:s形式の時刻文字列をミリ秒に換算する", () => {
    expect(parseHMS("01:23:45")).toBe(5025000);
  });

  it("0埋めの時刻文字列もミリ秒に換算する", () => {
    expect(parseHMS("00:30:00")).toBe(1800000);
  });

  it("数値として解釈できない文字列を渡すとnullを返す", () => {
    expect(parseHMS("xx:30:00")).toBeNull();
  });

  it("空文字を渡すとnullを返す", () => {
    expect(parseHMS("")).toBeNull();
  });

  it("分・秒が範囲外(60以上)の場合はnullを返す", () => {
    expect(parseHMS("0:99:99")).toBeNull();
  });
});
