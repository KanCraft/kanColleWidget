import { expect, describe, it, vi, beforeEach } from "vitest";

vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = { runtime: { getURL: (p: string) => p } };
});

const { createWorker } = vi.hoisted(() => ({ createWorker: vi.fn() }));
vi.mock("tesseract.js", () => ({
  createWorker,
  OEM: { LSTM_ONLY: "lstm_only" },
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fakeWorker(overrides: Record<string, any> = {}) {
  return {
    setParameters: vi.fn().mockResolvedValue(undefined),
    recognize: vi.fn().mockResolvedValue({ data: { text: "00:00:00" } }),
    ...overrides,
  };
}

// OCR用Workerの生成コストが高い(WASM初期化+言語データ読み込み)ため使い回す実装の契約を検証する。
// モジュール内の singleton 状態をテスト間で共有しないよう、各テストで resetModules して読み直す。
describe("ocrWorker", () => {
  beforeEach(() => {
    vi.resetModules();
    createWorker.mockReset();
  });

  it("getWorkerを複数回呼んでも、Workerの生成は1回だけ行われる", async () => {
    const worker = fakeWorker();
    createWorker.mockResolvedValue(worker);
    const { getWorker } = await import("../src/injection/ocrWorker");

    const [w1, w2] = await Promise.all([getWorker(), getWorker()]);

    expect(createWorker).toHaveBeenCalledTimes(1);
    expect(w1).toBe(worker);
    expect(w2).toBe(worker);
  });

  it("Workerの生成に失敗したら、次回呼び出しで作り直す", async () => {
    createWorker.mockRejectedValueOnce(new Error("boom"));
    const worker = fakeWorker();
    createWorker.mockResolvedValueOnce(worker);
    const { getWorker } = await import("../src/injection/ocrWorker");

    await expect(getWorker()).rejects.toThrow("boom");
    await expect(getWorker()).resolves.toBe(worker);
    expect(createWorker).toHaveBeenCalledTimes(2);
  });

  it("ocr()の認識(recognize)が失敗しても、次回呼び出しではWorkerを作り直して成功する", async () => {
    const brokenWorker = fakeWorker({ recognize: vi.fn().mockRejectedValue(new Error("recognize failed")) });
    const freshWorker = fakeWorker();
    createWorker.mockResolvedValueOnce(brokenWorker).mockResolvedValueOnce(freshWorker);
    const { ocr } = await import("../src/injection/ocrWorker");

    await expect(ocr("data:image/png;base64,xxx")).rejects.toThrow("recognize failed");
    await expect(ocr("data:image/png;base64,xxx")).resolves.toEqual({ data: { text: "00:00:00" } });
    expect(createWorker).toHaveBeenCalledTimes(2);
  });

  it("warmUpOcrWorkerは呼び出し直後にWorker生成を開始する（完了を待たない）", async () => {
    let resolveWorker!: (w: unknown) => void;
    createWorker.mockReturnValue(new Promise((resolve) => { resolveWorker = resolve; }));
    const { warmUpOcrWorker } = await import("../src/injection/ocrWorker");

    warmUpOcrWorker();

    expect(createWorker).toHaveBeenCalledTimes(1);
    resolveWorker(fakeWorker());
  });
});
