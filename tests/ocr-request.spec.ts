import { expect, describe, it, vi, beforeEach } from "vitest";

// kcsapi.ts の import 連鎖が chrome.runtime を参照するため、import より前にスタブする
const { sendMessage } = vi.hoisted(() => {
  const sendMessage = vi.fn().mockResolvedValue(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
    notifications: { getAll: vi.fn(), clear: vi.fn() },
    tabs: { sendMessage },
  };
  return { sendMessage };
});

const { deleteSlot } = vi.hoisted(() => ({
  deleteSlot: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("../src/models/Queue", () => ({ default: { deleteSlot, create: vi.fn().mockResolvedValue({ entry: () => ({}) }) } }));

const { capture } = vi.hoisted(() => ({
  capture: vi.fn().mockResolvedValue("data:image/jpeg;base64,stub"),
}));
vi.mock("../src/services/TabService", () => ({
  TabService: class {
    get = vi.fn().mockResolvedValue({ windowId: 42 });
    capture = capture;
  },
}));

const { crop } = vi.hoisted(() => ({ crop: vi.fn().mockResolvedValue("cropped-data-url") }));
vi.mock("../src/services/CropService", () => ({
  CropService: class {
    crop = crop;
  },
}));

vi.mock("../src/utils", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  sleep: vi.fn().mockResolvedValue(undefined),
  WorkerImage: { from: vi.fn().mockResolvedValue({}) },
}));

import { onRecoveryStart, onCreateShip } from "../src/controllers/WebRequest/kcsapi";
import { EntryType } from "../src/models/entry";

// ハンドラに渡す webRequest details の最小構成
const details = (formData: Record<string, string[]>) =>
  [{ tabId: 10, requestBody: { formData } }] as unknown as chrome.webRequest.OnBeforeRequestDetails[];

beforeEach(() => {
  capture.mockClear();
  sendMessage.mockClear();
  crop.mockClear();
  deleteSlot.mockClear();
});

// kcsapi.ts の requestOcr に集約した「撮影→切り出し→OCR依頼」の契約を固定する回帰テスト。
// onRecoveryStart / onCreateShip のどちらから呼ばれても同じ形のメッセージを送ることを検証する。
describe("requestOcr の契約(修復/建造共通)", () => {
  it("修復開始時: 撮影したウィンドウを対象に(type, {dock})でcropし、その結果をOCR依頼メッセージで送る", async () => {
    await onRecoveryStart(details({ api_highspeed: ["0"], api_ndock_id: ["3"], api_ship_id: ["100"] }));

    expect(capture).toHaveBeenCalledWith(42, { format: "jpeg" });
    expect(crop).toHaveBeenCalledWith(EntryType.RECOVERY, { dock: "3" });
    expect(sendMessage).toHaveBeenCalledWith(10, {
      __action__: "/injected/dmm/ocr",
      url: "cropped-data-url",
      purpose: EntryType.RECOVERY,
      [EntryType.RECOVERY]: { dock: "3" },
    });
  });

  it("建造開始時: 撮影したウィンドウを対象に(type, {dock})でcropし、その結果をOCR依頼メッセージで送る", async () => {
    await onCreateShip(details({ api_highspeed: ["0"], api_kdock_id: ["5"] }));

    expect(capture).toHaveBeenCalledWith(42, { format: "jpeg" });
    expect(crop).toHaveBeenCalledWith(EntryType.SHIPBUILD, { dock: "5" });
    expect(sendMessage).toHaveBeenCalledWith(10, {
      __action__: "/injected/dmm/ocr",
      url: "cropped-data-url",
      purpose: EntryType.SHIPBUILD,
      [EntryType.SHIPBUILD]: { dock: "5" },
    });
  });
});
