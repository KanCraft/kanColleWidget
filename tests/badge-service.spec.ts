import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";

// jstorm の Model が chrome.runtime を参照するため、import より前にスタブする
const { setBadgeText, setBadgeBackgroundColor } = vi.hoisted(() => {
  const setBadgeText = vi.fn().mockResolvedValue(undefined);
  const setBadgeBackgroundColor = vi.fn().mockResolvedValue(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { getURL: (p: string) => p },
    action: { setBadgeText, setBadgeBackgroundColor },
  };
  return { setBadgeText, setBadgeBackgroundColor };
});

import Queue from "../src/models/Queue";
import { EntryType } from "../src/models/entry";
import { BadgeService } from "../src/services/BadgeService";

const H = 60 * 60 * 1000;
const M = 60 * 1000;

const fakeQueue = (type: EntryType, scheduled: number) => Queue.new({ type, scheduled });

// バッジは「完了が最も近いQueueの残り時間＋種別色」を表示する契約であることを検証する。
describe("BadgeService.update", () => {
  beforeEach(() => {
    setBadgeText.mockClear();
    setBadgeBackgroundColor.mockClear();
    // 残り時間の文字列を決定的にするため、現在時刻を固定する
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("期限前のQueueが無ければバッジを消す", async () => {
    await new BadgeService().update([fakeQueue(EntryType.MISSION, -1000)]);
    expect(setBadgeText).toHaveBeenCalledWith({ text: "" });
    expect(setBadgeBackgroundColor).not.toHaveBeenCalled();
  });

  it("残り1時間以上は時間単位で表示する", async () => {
    await new BadgeService().update([fakeQueue(EntryType.MISSION, 2 * H + 30 * M)]);
    expect(setBadgeText).toHaveBeenCalledWith({ text: "2h" });
    expect(setBadgeBackgroundColor).toHaveBeenCalledWith({ color: "#5755d9" });
  });

  it("残り1時間未満は分単位で表示する", async () => {
    await new BadgeService().update([fakeQueue(EntryType.RECOVERY, 35 * M)]);
    expect(setBadgeText).toHaveBeenCalledWith({ text: "35m" });
    expect(setBadgeBackgroundColor).toHaveBeenCalledWith({ color: "#56c2c1" });
  });

  it("複数のQueueがあれば完了が最も近いものを表示する", async () => {
    await new BadgeService().update([
      fakeQueue(EntryType.MISSION, 3 * H),
      fakeQueue(EntryType.SHIPBUILD, 40 * M),
      fakeQueue(EntryType.RECOVERY, 2 * H),
    ]);
    expect(setBadgeText).toHaveBeenCalledWith({ text: "40m" });
    expect(setBadgeBackgroundColor).toHaveBeenCalledWith({ color: "#fa9836" });
  });

  it("期限を過ぎたQueueは表示対象から除外する", async () => {
    await new BadgeService().update([
      fakeQueue(EntryType.MISSION, -1000),
      fakeQueue(EntryType.FATIGUE, 10 * M),
    ]);
    expect(setBadgeText).toHaveBeenCalledWith({ text: "10m" });
    expect(setBadgeBackgroundColor).toHaveBeenCalledWith({ color: "gray" });
  });
});
