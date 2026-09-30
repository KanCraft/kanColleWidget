import { expect, describe, it, vi, beforeEach } from "vitest";

// import 連鎖の chromite と NotificationConfig の static default が chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
  };
});

const { notify, notifyRaw, clear } = vi.hoisted(() => ({
  notify: vi.fn().mockResolvedValue(""),
  notifyRaw: vi.fn(),
  clear: vi.fn().mockResolvedValue(true),
}));
vi.mock("../src/services/NotificationService", () => ({
  NotificationService: vi.fn(function () { return { notify, notifyRaw, clear }; }),
}));
vi.mock("../src/services/BadgeService", () => ({
  BadgeService: vi.fn(function () { return { update: vi.fn().mockResolvedValue(undefined) }; }),
}));

import { Once } from "../src/controllers/Cron/QueueWatcher";
import Queue from "../src/models/Queue";
import { EntryType, Mission, TriggerType } from "../src/models/entry";
import { BehaviorConfig } from "../src/models/configs/BehaviorConfig";
import { M } from "../src/utils";

// 遠征帰投予告（#935）: 完了通知の n 分前（既定3分）に、遠征Queueごとに1回だけ予告を出す。
// 予告の有効/無効は NotificationService.notifyRaw の中で NotificationConfig を見て決まるため、
// ここでは notifyRaw の戻り値（空文字 = 無効で出さなかった）で有効/無効を表す。
describe("QueueWatcher の遠征帰投予告", () => {
  const mission = (remain: number, props: Partial<Queue> = {}) => Queue.create({
    type: EntryType.MISSION,
    scheduled: Date.now() + remain,
    params: { deck: 2, id: 5, title: "海上護衛任務" },
    ...props,
  });

  beforeEach(async () => {
    for (const q of await Queue.list()) await q.delete();
    notify.mockClear();
    notifyRaw.mockReset();
    notifyRaw.mockImplementation(async (id: string) => id);
    clear.mockClear();
  });

  it("完了通知の3分前を過ぎたら予告を1回だけ出し、予告済みの印を保存する", async () => {
    const q = await mission(2 * M);
    await Once();
    expect(notifyRaw).toHaveBeenCalledTimes(1);
    expect(notifyRaw.mock.calls[0][0]).toBe("/mission/remind/2");
    expect((await Queue.find(q._id!))!.reminded).toBe(true);

    await Once();
    expect(notifyRaw).toHaveBeenCalledTimes(1);
  });

  it("予告の時間帯より前なら何もしない", async () => {
    await mission(4 * M);
    await Once();
    expect(notifyRaw).not.toHaveBeenCalled();
  });

  it("予告が無効で出さなかったときは印を付けない（途中で有効にすれば完了前に予告が出る）", async () => {
    notifyRaw.mockResolvedValue("");
    const q = await mission(2 * M);
    await Once();
    expect((await Queue.find(q._id!))!.reminded).toBe(false);
  });

  it("設定した分数で予告の時間帯と文言が決まる", async () => {
    await (await BehaviorConfig.user()).update({ missionRemindMinutes: 10 });
    await mission(8 * M);
    await Once();
    expect(notifyRaw).toHaveBeenCalledTimes(1);
    const build = notifyRaw.mock.calls[0][2];
    expect(build({ icon: null, stay: false }).message).toContain("約10分後");
    await (await BehaviorConfig.user()).update({ missionRemindMinutes: 3 });
  });

  it("予告済み・出撃中の支援遠征・遠征以外のQueueには予告しない", async () => {
    await mission(2 * M, { reminded: true });
    await mission(2 * M, { sortied: true });
    await Queue.create({ type: EntryType.FATIGUE, scheduled: Date.now() + 2 * M, params: { deck: 1 } });
    await Once();
    expect(notifyRaw).not.toHaveBeenCalled();
  });

  it("完了通知を出したら、同じ艦隊の予告通知も消す", async () => {
    await mission(-1000, { reminded: true });
    await Once();
    expect(notify).toHaveBeenCalledTimes(1);
    expect(clear).toHaveBeenCalledWith("/mission/remind/2");
  });
});

describe("Queue.inRemindWindow", () => {
  it("完了通知の lead ミリ秒前以降なら true", () => {
    const now = Date.now();
    const q = Queue.new({ type: EntryType.MISSION, scheduled: now + 3 * M, params: {} });
    expect(q.inRemindWindow(3 * M, now)).toBe(true);
    expect(q.inRemindWindow(3 * M, now - 1)).toBe(false);
  });
});

describe("Mission の帰投予告の通知文", () => {
  it("タイトルと本文に遠征名・艦隊・分数が入る", () => {
    const m = new Mission("3", 5, { title: "海上護衛任務", category: "test", time: 90 * M });
    const options = m.$n.remind(5);
    expect(options.title).toBe("遠征帰投予告 海上護衛任務");
    expect(options.message).toBe("約5分後、第3艦隊が「海上護衛任務」から帰投する予定です");
  });

  it("REMIND を options で組み立てても完了通知の文面にならない", () => {
    const m = new Mission("3", 5, { title: "海上護衛任務", category: "test", time: 90 * M });
    expect(m.$n.options(TriggerType.REMIND).title).toBe("遠征帰投予告 海上護衛任務");
    expect(m.$n.id(TriggerType.REMIND)).toBe("/mission/remind/3");
  });
});
