import { expect, describe, it } from "vitest";

import { KCWDate } from "../src/utils";

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
