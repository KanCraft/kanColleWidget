import { expect, describe, it, vi } from "vitest";

import { QuestProgress, QuestStatus } from "../src/models/QuestProgress";
import { quests } from "../src/catalog";
import { KCWDate } from "../src/utils";
import { restoreDefaultsBeforeEach } from "./helpers/jstorm-defaults";

restoreDefaultsBeforeEach(QuestProgress);

describe("QuestProgress 初期状態", () => {
  it.each([303, 201])("前提任務のない任務(id=%i)はOPENで始まる", async (id) => {
    const progress = await QuestProgress.user();
    expect(progress.statuses[id]).toBe(QuestStatus.OPEN);
  });

  it.each([304, 216])("前提任務のある任務(id=%i)はLOCKEDで始まる", async (id) => {
    const progress = await QuestProgress.user();
    expect(progress.statuses[id]).toBe(QuestStatus.LOCKED);
  });
});

describe("start/stop", () => {
  it("start()でONGOINGになる", async () => {
    const progress = await QuestProgress.user();
    const updated = await progress.start(303);
    expect(updated.statuses[303]).toBe(QuestStatus.ONGOING);
  });

  it("stop()でOPENに戻る", async () => {
    const progress = await QuestProgress.user();
    const started = await progress.start(303);
    const stopped = await started.stop(303);
    expect(stopped.statuses[303]).toBe(QuestStatus.OPEN);
  });

  it("カタログに無いIDはno-op", async () => {
    const progress = await QuestProgress.user();
    const updated = await progress.start(99999);
    expect(updated.statuses[99999]).toBeUndefined();
  });
});

describe("complete() による前提任務の連鎖解放", () => {
  it("303完了で304がLOCKED→OPENになる", async () => {
    const progress = await QuestProgress.user();
    const completed = await progress.complete(303);
    expect(completed.statuses[303]).toBe(QuestStatus.COMPLETED);
    expect(completed.statuses[304]).toBe(QuestStatus.OPEN);
  });

  it("608完了で609と619の両方がOPENになる（1つの完了が複数任務を解放する）", async () => {
    const progress = await QuestProgress.user();
    const completed = await progress.complete(608);
    expect(completed.statuses[609]).toBe(QuestStatus.OPEN);
    expect(completed.statuses[619]).toBe(QuestStatus.OPEN);
  });
});

describe("availables()", () => {
  it("カテゴリと日付条件でフィルタする", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new KCWDate("August 10, 2024 12:00:00")); // 日付下1桁が0 → date037対象日
    const progress = await QuestProgress.user();
    // 211/212/216 は201完了で初めてOPENになる（211/212の条件差を見るための前提解放）
    const completed = await progress.complete(201);
    const sorties = completed.availables("sortie");
    expect(sorties).toContain(216); // 条件なし
    expect(sorties).toContain(211); // date037対象なので出現する
    expect(sorties).not.toContain(212); // date28対象外の日なので出現しない
    vi.useRealTimers();
  });

  it("着手済み(ONGOING)の任務はavailablesに含まれない", async () => {
    const progress = await QuestProgress.user();
    const started = await progress.start(303);
    expect(started.availables("practice")).not.toContain(303);
  });

  it("他カテゴリの任務は含まれない", async () => {
    const progress = await QuestProgress.user();
    expect(progress.availables("practice")).not.toContain(201);
  });
});

describe("日次リセット（朝5時境界）", () => {
  it("同じ艦これ日のうちは着手状態が保たれる", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new KCWDate("August 10, 2024 06:00:00"));
    await (await QuestProgress.user()).start(303);

    vi.setSystemTime(new KCWDate("August 10, 2024 23:00:00"));
    const progress = await QuestProgress.user();
    expect(progress.statuses[303]).toBe(QuestStatus.ONGOING);
    vi.useRealTimers();
  });

  it("朝5時を跨ぐと着手状態がリセットされる", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new KCWDate("August 10, 2024 06:00:00"));
    await (await QuestProgress.user()).start(303);

    vi.setSystemTime(new KCWDate("August 11, 2024 06:00:00"));
    const progress = await QuestProgress.user();
    expect(progress.statuses[303]).toBe(QuestStatus.OPEN);
    vi.useRealTimers();
  });
});

// 任務トラッカー表示用。606は605(未着手のまま推移)に依存し、他のテストで触れられないので
// 「LOCKEDのまま」を安定して検証できる
describe("visibleQuests()", () => {
  it("LOCKEDな任務は含まれない", async () => {
    const progress = await QuestProgress.user();
    expect(progress.statuses[606]).toBe(QuestStatus.LOCKED);
    expect(progress.visibleQuests().some((q) => q.id === 606)).toBe(false);
  });

  it("未着手→遂行中→達成の順に並ぶ", async () => {
    const progress = await QuestProgress.user();
    await progress.start(402);
    await progress.complete(503);
    const visible = progress.visibleQuests();
    const firstOpenIndex = visible.findIndex((q) => q.status === QuestStatus.OPEN);
    const ongoingIndex = visible.findIndex((q) => q.id === 402);
    const completedIndex = visible.findIndex((q) => q.id === 503);
    expect(firstOpenIndex).toBeLessThan(ongoingIndex);
    expect(ongoingIndex).toBeLessThan(completedIndex);
  });

  it("カタログのtitle/categoryを持つ", async () => {
    const progress = await QuestProgress.user();
    const entry = progress.visibleQuests().find((q) => q.id === 303);
    expect(entry?.title).toBe(quests["303"].title);
    expect(entry?.category).toBe("practice");
  });

  it("日付条件に合わない任務は、前提任務が解放されていても含まれない", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new KCWDate("August 10, 2024 12:00:00")); // 日付下1桁が0 → date28(2,8)対象外
    const progress = await QuestProgress.user();
    await progress.complete(201); // 212のLOCKEDを解除する
    expect(progress.visibleQuests().some((q) => q.id === 212)).toBe(false);
    vi.useRealTimers();
  });
});
