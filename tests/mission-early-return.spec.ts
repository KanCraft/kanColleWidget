import { expect, describe, it, beforeAll, vi } from "vitest";

import { Mission } from "../src/models/entry";
import { TriggerType } from "../src/models/entry";
import { MissionSpec } from "../src/catalog";
import { KCWDate } from "../src/utils";

// 遠征は残り1分を切ると母港復帰で即完了する仕様のため、通知を一律で1分早める（#1811）。
beforeAll(() => {
  // Mission.$n.options は iconUrl の解決に chrome.runtime.getURL を参照する
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = { runtime: { getURL: (p: string) => p } };
});

describe("Mission early-return margin (#1811)", () => {
  it("EARLY_RETURN_MARGIN は1分", () => {
    expect(Mission.EARLY_RETURN_MARGIN).toBe(60_000);
  });

  it("開始通知の終了予定時刻はゲーム内表示に合わせて補正しない", () => {
    vi.useFakeTimers();
    // 2024-08-25 07:00:00 を基準に、表示30分の「長距離練習航海」を出航させる
    vi.setSystemTime(new KCWDate("August 25, 2024 07:00:00"));

    const spec: MissionSpec = { title: "長距離練習航海", category: "others", time: 30 * 60 * 1000 };
    const m = new Mission("2", 2, spec);
    const options = m.$n.options(TriggerType.START);

    // 開始通知はゲーム内カウントダウンの表示時間(30分後=07:30)をそのまま示す
    expect(options.message).toContain("07:30");

    vi.useRealTimers();
  });
});
