import { expect, describe, it, vi, beforeEach, afterEach } from "vitest";

// chrome.notifications を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: {
      id: "test",
      onMessage: { addListener: () => {} },
      getURL: (path: string) => `chrome-extension://test/${path}`,
    },
    notifications: {
      // NotificationService.create/clear はコールバック経由でPromiseを解決するため、素の vi.fn() だとawaitがハングする
      create: vi.fn((id: string, _options: unknown, cb?: (id: string) => void) => cb?.(id)),
      clear: vi.fn((id: string, cb?: (wasCleared: boolean) => void) => cb?.(true)),
    },
  };
});

import { onPracticePrepare, onSortiePrepare } from "../src/controllers/WebRequest/quest";
import { NotificationConfig, QUEST_ALERT_NOTIFICATION_ID } from "../src/models/configs/NotificationConfig";
import { QuestProgress } from "../src/models/QuestProgress";

const create = chrome.notifications.create as unknown as ReturnType<typeof vi.fn>;
const clear = chrome.notifications.clear as unknown as ReturnType<typeof vi.fn>;

// 消去方式(stay)が既定のfalse(自動)だと10秒後に自動でclearされる。fake timerで固定し、
// 実時間の待ちタイマーをテストプロセスに残さないようにする。
beforeEach(() => {
  // mockReset() だとコールバックを呼ぶ実装（hoisted側で設定）まで消えてPromiseがハングするので、
  // 呼び出し履歴だけ消す mockClear() を使う
  create.mockClear();
  clear.mockClear();
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

// 演習・出撃の画面遷移(api_get_member/practice, mapinfo)で、未着手の任務があるときだけ
// NotificationConfig("/quest-alert/start")の設定に沿って通知を出す。
describe("onPracticePrepare", () => {
  it("演習任務が未着手なら通知を出し、アイコンは他の通知と同じ既定値を使う", async () => {
    await onPracticePrepare();
    expect(clear).toHaveBeenCalledWith("/quest-alert/practice", expect.any(Function));
    expect(create).toHaveBeenCalledTimes(1);
    const [id, options] = create.mock.calls[0] as [string, chrome.notifications.NotificationCreateOptions];
    expect(id).toBe("/quest-alert/practice");
    expect(options.message).toContain("「演習」で練度向上！");
    expect(options.iconUrl).toBe("chrome-extension://test/icons/128.png");
  });

  it("演習任務に着手済みなら通知を出さない", async () => {
    const progress = await QuestProgress.user();
    await progress.start(303);
    try {
      await onPracticePrepare();
      expect(create).not.toHaveBeenCalled();
    } finally {
      // QuestProgress も default が書き換わる同種の問題があるため、着手状態を戻しておく
      await progress.stop(303);
    }
  });

  it("設定が無効なら通知を出さない", async () => {
    const config = (await NotificationConfig.find(QUEST_ALERT_NOTIFICATION_ID))!;
    await config.update({ enabled: false });
    try {
      await onPracticePrepare();
      expect(create).not.toHaveBeenCalled();
    } finally {
      // jstorm は保存先が空のとき static default をその場で書き換えるため、
      // ここで false のまま残すと他テストの既定値に波及する。明示的に戻す
      await config.update({ enabled: true });
    }
  });

  it("消去方式が既定(自動)なら10秒後に自動でclearされる", async () => {
    await onPracticePrepare();
    expect(clear).toHaveBeenCalledTimes(1); // 発火直前のclearのみ
    vi.advanceTimersByTime(10_000);
    expect(clear).toHaveBeenCalledTimes(2); // 自動消去分
  });

  it("消去方式を手動にすると自動では消えない", async () => {
    const config = (await NotificationConfig.find(QUEST_ALERT_NOTIFICATION_ID))!;
    await config.update({ stay: true });
    try {
      await onPracticePrepare();
      vi.advanceTimersByTime(10_000);
      expect(clear).toHaveBeenCalledTimes(1); // 発火直前のclearのみ
    } finally {
      await config.update({ stay: false });
    }
  });
});

describe("onSortiePrepare", () => {
  it("出撃任務が未着手なら通知を出す", async () => {
    await onSortiePrepare();
    expect(clear).toHaveBeenCalledWith("/quest-alert/sortie", expect.any(Function));
    expect(create).toHaveBeenCalledTimes(1);
    const [id, options] = create.mock.calls[0] as [string, chrome.notifications.NotificationCreateOptions];
    expect(id).toBe("/quest-alert/sortie");
    expect(options.message).toContain("敵艦隊を撃破せよ！");
  });

  it("出撃任務に着手済みなら通知を出さない", async () => {
    const progress = await QuestProgress.user();
    await progress.start(201);
    try {
      await onSortiePrepare();
      expect(create).not.toHaveBeenCalled();
    } finally {
      await progress.stop(201);
    }
  });
});
