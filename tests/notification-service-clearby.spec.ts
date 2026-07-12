import { expect, describe, it, vi, beforeEach } from "vitest";

// NotificationService が chrome.notifications / chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", getURL: (path: string) => `chrome-extension://test/${path}` },
    notifications: {
      getAll: vi.fn(),
      clear: vi.fn(),
    },
  };
});

import { NotificationService } from "../src/services/NotificationService";
import { EntryType, TriggerType } from "../src/models/entry";

const getAll = chrome.notifications.getAll as unknown as ReturnType<typeof vi.fn>;
const clear = chrome.notifications.clear as unknown as ReturnType<typeof vi.fn>;

// 表示中の通知IDを与えてスタブを構成する（どちらもコールバック形式のAPI）
const displaying = (ids: string[]) => {
  getAll.mockImplementation((cb: (n: Record<string, boolean>) => void) => {
    cb(Object.fromEntries(ids.map((id) => [id, true])));
  });
  clear.mockImplementation((_id: string, cb?: (wasCleared: boolean) => void) => cb?.(true));
};

const clearedIds = () => clear.mock.calls.map(([id]) => id).sort();

// clearBy は表示中の通知を走査し、NotificationId.matches の条件に一致するものだけを消す。
// 条件の粒度（type のみ / type+trigger / type+target）で絞り込みが変わることを検証する。
describe("NotificationService.clearBy による通知の絞り込み消去", () => {
  beforeEach(() => {
    getAll.mockReset();
    clear.mockReset();
  });

  it("type と target を指定すると、そのドックの開始・完了通知だけを消し他は残す", async () => {
    displaying([
      "/recovery/start/2",
      "/recovery/end/2",
      "/recovery/start/1",
      "/mission/end/2",
    ]);
    await NotificationService.new().clearBy({ type: EntryType.RECOVERY, target: "2" });
    expect(clearedIds()).toEqual(["/recovery/end/2", "/recovery/start/2"]);
  });

  it("target を 1 にしても /recovery/start/11 のような部分一致は消さない", async () => {
    displaying(["/recovery/start/1", "/recovery/start/11"]);
    await NotificationService.new().clearBy({ type: EntryType.RECOVERY, target: "1" });
    expect(clearedIds()).toEqual(["/recovery/start/1"]);
  });

  it("type と trigger を指定すると、その種別の完了通知だけを消す（開始通知は残す）", async () => {
    displaying([
      "/recovery/start/1",
      "/recovery/end/1",
      "/recovery/end/2",
      "/mission/end/1",
    ]);
    await NotificationService.new().clearBy({ type: EntryType.RECOVERY, trigger: TriggerType.END });
    expect(clearedIds()).toEqual(["/recovery/end/1", "/recovery/end/2"]);
  });

  it("type だけを指定すると、その種別の通知を全トリガー・全対象で消す", async () => {
    displaying([
      "/mission/start/2",
      "/mission/end/2",
      "/recovery/end/2",
    ]);
    await NotificationService.new().clearBy({ type: EntryType.MISSION });
    expect(clearedIds()).toEqual(["/mission/end/2", "/mission/start/2"]);
  });
});
