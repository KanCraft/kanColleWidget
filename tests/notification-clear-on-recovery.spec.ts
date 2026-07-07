import { expect, describe, it, vi, beforeEach } from "vitest";

// NotificationService が chrome.notifications を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: {
      id: "test",
      onMessage: { addListener: () => {} },
      getURL: (path: string) => `chrome-extension://test/${path}`,
    },
    notifications: {
      getAll: vi.fn(),
      clear: vi.fn(),
    },
  };
});

import { onComplete } from "../src/controllers/WebRequest";

const getAll = chrome.notifications.getAll as unknown as ReturnType<typeof vi.fn>;
const clear = chrome.notifications.clear as unknown as ReturnType<typeof vi.fn>;

// 表示中の通知IDを与えてスタブを構成する（コールバック形式のAPI）
const displaying = (ids: string[]) => {
  getAll.mockImplementation((cb: (n: Record<string, boolean>) => void) => {
    cb(Object.fromEntries(ids.map((id) => [id, true])));
  });
};

const clearedIds = () => clear.mock.calls.map(([id]) => id);

// ルーター（SequentialRouter）経由でイベントを流し、ルーティング挙動ごと検証する
const listener = onComplete.listener();
const fire = async (path: string) => {
  listener({ url: `https://w00g.kancolle-server.com${path}` } as unknown as chrome.webRequest.OnCompletedDetails);
  // listener はハンドラを Promise チェーンで実行するため、完了を待って戻る
  await new Promise((resolve) => setTimeout(resolve, 0));
};

// 入渠画面に遷移した（api_get_member/ndock が発行された）とき、修復の完了通知が消えることを検証する。
// 通知IDは /{type}/{trigger}/{deck|dock} 形式（tests/notification-id.spec.ts 参照）。
describe("入渠画面遷移時の修復通知クリア", () => {
  beforeEach(() => {
    getAll.mockReset();
    clear.mockReset();
  });

  it("母港以外の画面から入渠画面に遷移しても（直前のAPIが port でなくても）修復完了通知を消す", async () => {
    displaying(["/recovery/end/2", "/recovery/end/3"]);
    await fire("/kcsapi/api_req_hensei/change"); // 編成画面での操作
    await fire("/kcsapi/api_get_member/ndock"); // 入渠画面への遷移
    expect(clearedIds()).toEqual(expect.arrayContaining(["/recovery/end/2", "/recovery/end/3"]));
    expect(clearedIds()).toHaveLength(2);
  });

  // 入渠開始直後にもゲームは ndock を再取得するため、開始通知をクリア対象にすると
  // OCR経由で出た開始通知がサーバ応答時間次第で即消えてしまう（タイミング依存になる）。
  it("修復開始通知は消さない（入渠開始直後の ndock 再取得と競合するため）", async () => {
    displaying(["/recovery/start/1", "/recovery/end/2"]);
    await fire("/kcsapi/api_get_member/ndock");
    expect(clearedIds()).toEqual(["/recovery/end/2"]);
  });

  it("修復以外の通知は消さない", async () => {
    displaying(["/recovery/end/1", "/mission/end/2", "/shipbuild/end/3"]);
    await fire("/kcsapi/api_get_member/ndock");
    expect(clearedIds()).toEqual(["/recovery/end/1"]);
  });
});
