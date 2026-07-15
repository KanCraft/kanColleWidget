import { expect, describe, it, vi, beforeEach } from "vitest";

// kcsapi.ts の import 連鎖が chrome.runtime を参照するため、import より前にスタブする
const { captureVisibleTab, sendMessage } = vi.hoisted(() => {
  const captureVisibleTab = vi.fn().mockResolvedValue("data:image/jpeg;base64,stub");
  const sendMessage = vi.fn().mockResolvedValue(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
    notifications: { getAll: vi.fn(), clear: vi.fn() },
    tabs: { captureVisibleTab, sendMessage },
  };
  return { captureVisibleTab, sendMessage };
});

const { deleteSlot, create } = vi.hoisted(() => ({
  deleteSlot: vi.fn().mockResolvedValue(undefined),
  create: vi.fn().mockResolvedValue({ entry: () => ({}) }),
}));
vi.mock("../src/models/Queue", () => ({ default: { deleteSlot, create } }));

vi.mock("../src/services/TabService", () => ({
  TabService: class {
    get = vi.fn().mockResolvedValue({ windowId: 1 });
    capture = vi.fn().mockResolvedValue("data:image/jpeg;base64,stub");
  },
}));
vi.mock("../src/services/CropService", () => ({
  CropService: class {
    crop = vi.fn().mockResolvedValue("cropped-data-url");
  },
}));
vi.mock("../src/utils", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  sleep: vi.fn().mockResolvedValue(undefined),
  WorkerImage: { from: vi.fn().mockResolvedValue({}) },
}));

import { onRecoveryStart, onCreateShip } from "../src/controllers/WebRequest/kcsapi";

// ハンドラに渡す webRequest details の最小構成
const details = (formData: Record<string, string[]>) =>
  [{ tabId: 10, requestBody: { formData } }] as unknown as chrome.webRequest.OnBeforeRequestDetails[];

beforeEach(() => {
  deleteSlot.mockClear();
  create.mockClear();
  captureVisibleTab.mockClear();
  sendMessage.mockClear();
});

describe("入渠開始時の高速修復材同時使用(api_highspeed)", () => {
  it("同時使用時: 即完了するのでOCR依頼を送らず、同ドックの既存Queueだけ掃除する", async () => {
    await onRecoveryStart(details({ api_highspeed: ["1"], api_ndock_id: ["2"], api_ship_id: ["100"] }));
    expect(deleteSlot).toHaveBeenCalledWith("recovery", "2");
    expect(sendMessage).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it("通常入渠時: OCR依頼を送る（Queue登録はOCR結果側で行うためここでは触らない）", async () => {
    await onRecoveryStart(details({ api_highspeed: ["0"], api_ndock_id: ["3"], api_ship_id: ["100"] }));
    expect(sendMessage).toHaveBeenCalledWith(10, expect.objectContaining({
      __action__: "/injected/dmm/ocr",
      purpose: "recovery",
      recovery: { dock: "3" },
    }));
    expect(deleteSlot).not.toHaveBeenCalled();
  });
});

describe("建造開始時の高速建造材同時使用(api_highspeed)", () => {
  it("同時使用時: 即完了するのでOCR依頼を送らず、同ドックの既存Queueだけ掃除する", async () => {
    await onCreateShip(details({ api_highspeed: ["1"], api_kdock_id: ["4"] }));
    expect(deleteSlot).toHaveBeenCalledWith("shipbuild", "4");
    expect(sendMessage).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it("通常建造時: OCR依頼を送る", async () => {
    await onCreateShip(details({ api_highspeed: ["0"], api_kdock_id: ["1"] }));
    expect(sendMessage).toHaveBeenCalledWith(10, expect.objectContaining({
      __action__: "/injected/dmm/ocr",
      purpose: "shipbuild",
      shipbuild: { dock: "1" },
    }));
    expect(deleteSlot).not.toHaveBeenCalled();
  });
});
