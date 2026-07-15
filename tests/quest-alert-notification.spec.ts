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
      create: vi.fn(async (id: string) => id),
      clear: vi.fn(async () => true),
    },
  };
});

import { onPracticePrepare, onSortiePrepare } from "../src/controllers/WebRequest/quest";
import { NotificationConfig, QUEST_ALERT_NOTIFICATION_ID } from "../src/models/configs/NotificationConfig";
import { QuestProgress } from "../src/models/QuestProgress";
import { restoreDefaultsBeforeEach } from "./helpers/jstorm-defaults";

const create = chrome.notifications.create as unknown as ReturnType<typeof vi.fn>;
const clear = chrome.notifications.clear as unknown as ReturnType<typeof vi.fn>;

restoreDefaultsBeforeEach(NotificationConfig, QuestProgress);

// 消去方式(stay)が既定のfalse(自動)だと10秒後に自動でclearされる。fake timerで固定し、
// 実時間の待ちタイマーをテストプロセスに残さないようにする。
beforeEach(() => {
  // mockReset() だと hoisted 側で設定した実装（Promise解決）まで消えてしまうので、
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
    expect(clear).toHaveBeenCalledWith("/quest-alert/practice");
    expect(create).toHaveBeenCalledTimes(1);
    const [id, options] = create.mock.calls[0] as [string, chrome.notifications.NotificationCreateOptions];
    expect(id).toBe("/quest-alert/practice");
    expect(options.message).toContain("「演習」で練度向上！");
    expect(options.iconUrl).toBe("chrome-extension://test/icons/128.png");
  });

  it("演習任務に着手済みなら通知を出さない", async () => {
    const progress = await QuestProgress.user();
    await progress.start(303);
    await onPracticePrepare();
    expect(create).not.toHaveBeenCalled();
  });

  it("設定が無効なら通知を出さない", async () => {
    const config = (await NotificationConfig.find(QUEST_ALERT_NOTIFICATION_ID))!;
    await config.update({ enabled: false });
    await onPracticePrepare();
    expect(create).not.toHaveBeenCalled();
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
    await onPracticePrepare();
    vi.advanceTimersByTime(10_000);
    expect(clear).toHaveBeenCalledTimes(1); // 発火直前のclearのみ
  });
});

describe("onSortiePrepare", () => {
  it("出撃任務が未着手なら通知を出す", async () => {
    await onSortiePrepare();
    expect(clear).toHaveBeenCalledWith("/quest-alert/sortie");
    expect(create).toHaveBeenCalledTimes(1);
    const [id, options] = create.mock.calls[0] as [string, chrome.notifications.NotificationCreateOptions];
    expect(id).toBe("/quest-alert/sortie");
    expect(options.message).toContain("敵艦隊を撃破せよ！");
  });

  it("出撃任務に着手済みなら通知を出さない", async () => {
    const progress = await QuestProgress.user();
    await progress.start(201);
    await onSortiePrepare();
    expect(create).not.toHaveBeenCalled();
  });
});
