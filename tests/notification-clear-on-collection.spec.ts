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

import { onMissionResult, onGetShip } from "../src/controllers/WebRequest/kcsapi";

const getAll = chrome.notifications.getAll as unknown as ReturnType<typeof vi.fn>;
const clear = chrome.notifications.clear as unknown as ReturnType<typeof vi.fn>;

// 表示中の通知IDを与えてスタブを構成する（コールバック形式のAPI）
const displaying = (ids: string[]) => {
  getAll.mockImplementation((cb: (n: Record<string, boolean>) => void) => {
    cb(Object.fromEntries(ids.map((id) => [id, true])));
  });
  clear.mockImplementation((_id: string, cb: (wasCleared: boolean) => void) => cb(true));
};

// ハンドラに渡す webRequest details の最小構成
const details = (formData: Record<string, string[]>) =>
  [{ requestBody: { formData } }] as unknown as chrome.webRequest.OnBeforeRequestDetails[];

const clearedIds = () => clear.mock.calls.map(([id]) => id);

// 回収操作（遠征結果回収・建造艦受取）で、対象の艦隊/ドックの通知だけが消えることを検証する。
// 通知IDは /{type}/{trigger}/{deck|dock} 形式（tests/notification-id.spec.ts 参照）。
describe("onMissionResult", () => {
  beforeEach(() => {
    getAll.mockReset();
    clear.mockReset();
  });

  it("回収した艦隊の遠征通知（開始・完了）を消す", async () => {
    displaying(["/mission/start/2", "/mission/end/2"]);
    await onMissionResult(details({ api_deck_id: ["2"] }));
    expect(clearedIds()).toEqual(expect.arrayContaining(["/mission/start/2", "/mission/end/2"]));
    expect(clearedIds()).toHaveLength(2);
  });

  it("他艦隊の遠征通知や、同じ艦隊番号の他タイプの通知は消さない", async () => {
    displaying(["/mission/end/2", "/mission/end/3", "/fatigue/end/2", "/recovery/end/2"]);
    await onMissionResult(details({ api_deck_id: ["2"] }));
    expect(clearedIds()).toEqual(["/mission/end/2"]);
  });
});

describe("onGetShip", () => {
  beforeEach(() => {
    getAll.mockReset();
    clear.mockReset();
  });

  it("受け取ったドックの建造通知（開始・完了）を消す", async () => {
    displaying(["/shipbuild/start/3", "/shipbuild/end/3"]);
    await onGetShip(details({ api_kdock_id: ["3"] }));
    expect(clearedIds()).toEqual(expect.arrayContaining(["/shipbuild/start/3", "/shipbuild/end/3"]));
    expect(clearedIds()).toHaveLength(2);
  });

  it("他ドックの建造通知は消さない", async () => {
    displaying(["/shipbuild/end/3", "/shipbuild/end/1", "/recovery/end/3"]);
    await onGetShip(details({ api_kdock_id: ["3"] }));
    expect(clearedIds()).toEqual(["/shipbuild/end/3"]);
  });
});
