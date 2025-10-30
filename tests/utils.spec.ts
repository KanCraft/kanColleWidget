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
