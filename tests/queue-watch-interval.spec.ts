import { expect, describe, it, vi, beforeAll, beforeEach } from "vitest";

// chromite はモジュール読み込み時に chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: {
      id: "test",
      onMessage: { addListener: () => {} },
      getURL: (path: string) => `chrome-extension://test/${path}`,
    },
  };
});

// QueueWatcher をモックし、アラーム1回の発火で監視間隔ごとに何回チェックされるかだけを検証する
const { Once } = vi.hoisted(() => ({ Once: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../src/controllers/Cron/QueueWatcher", () => ({ Once }));

// sleep を即時解決にして、待ち時間なしでループの回数と引数を検証する
const { sleep } = vi.hoisted(() => ({ sleep: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../src/utils", async (importOriginal) => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(await importOriginal() as any),
  sleep,
}));

import Alarm from "../src/controllers/Alarm";
import { BehaviorConfig } from "../src/models/configs/BehaviorConfig";

const fire = () => {
  const listener = Alarm.listener();
  // chromite の listener は同期的に呼び出され、ハンドラは Promise 内で実行される
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (listener as any)({ name: "/cron/queues" });
};

// アラーム周期（30秒）内を監視間隔で分割してチェックする回数のルール。
describe("Alarm /cron/queues の監視間隔", () => {
  // Alarm.ts はモジュール読み込みの10ms後にも Once を1回呼ぶため、
  // それが発火しきってから各テストのカウントを始める
  beforeAll(() => new Promise((resolve) => setTimeout(resolve, 30)));

  beforeEach(() => {
    Once.mockClear();
    sleep.mockClear();
  });

  it("既定（30秒）ではアラーム1回につき1回チェックし、待ち時間なし", async () => {
    fire();
    await vi.waitFor(() => expect(Once).toHaveBeenCalledTimes(1));
    expect(sleep).not.toHaveBeenCalled();
  });

  it("監視間隔10秒ではアラーム1回につき3回チェックし、間に10秒ずつ待つ", async () => {
    const config = await BehaviorConfig.user();
    await config.update({ queueWatchIntervalSeconds: 10 });
    fire();
    await vi.waitFor(() => expect(Once).toHaveBeenCalledTimes(3));
    expect(sleep).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledWith(10 * 1000);
  });

  it("監視間隔5秒ではアラーム1回につき6回チェックする", async () => {
    const config = await BehaviorConfig.user();
    await config.update({ queueWatchIntervalSeconds: 5 });
    fire();
    await vi.waitFor(() => expect(Once).toHaveBeenCalledTimes(6));
    expect(sleep).toHaveBeenCalledTimes(5);
  });

  it("選択肢にない保存値は既定の30秒として扱う", async () => {
    const config = await BehaviorConfig.user();
    await config.update({ queueWatchIntervalSeconds: 7 });
    fire();
    await vi.waitFor(() => expect(Once).toHaveBeenCalledTimes(1));
    expect(sleep).not.toHaveBeenCalled();
  });
});
