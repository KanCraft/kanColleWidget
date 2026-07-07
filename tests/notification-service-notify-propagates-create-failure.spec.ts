import { expect, describe, it, vi } from "vitest";

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
      create: vi.fn(async () => { throw new Error("notification create failed"); }),
      clear: vi.fn(async () => true),
    },
  };
});

import { NotificationService } from "../src/services/NotificationService";
import { NotificationConfig } from "../src/models/configs/NotificationConfig";
import { Fatigue } from "../src/models/entry";
import { restoreDefaultsBeforeEach } from "./helpers/jstorm-defaults";

restoreDefaultsBeforeEach(NotificationConfig);

// chrome.notifications.create はネイティブ Promise 形式なので、拡張機能側の権限不足等で
// 失敗すると reject される。notify() がその失敗を握りつぶさず呼び出し元に伝播することを検証する。
describe("NotificationService.notify", () => {
  it("create が失敗したら、その失敗を reject として呼び出し元に伝播する", async () => {
    const service = new NotificationService();
    const entry = new Fatigue("1", { area: 1, info: 1 });
    await expect(service.notify(entry)).rejects.toThrow("notification create failed");
  });
});
