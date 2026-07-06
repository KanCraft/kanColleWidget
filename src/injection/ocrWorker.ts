import { createWorker, OEM, type RecognizeResult, type WorkerParams } from 'tesseract.js';

// Tesseract.jsのWorkerはWASMエンジンと言語データの読み込みに数秒かかるため、
// OCRの都度作り直さずページ滞在中は使い回す。
let workerPromise: ReturnType<typeof createWorker> | null = null;

function createOcrWorker(): ReturnType<typeof createWorker> {
  return createWorker('eng', OEM.LSTM_ONLY, {
    workerPath: chrome.runtime.getURL('tessworker.min.js'),
    langPath: chrome.runtime.getURL('tessdata-4.0.0_best_int'),
  });
}

export function getWorker(): ReturnType<typeof createWorker> {
  if (!workerPromise) {
    workerPromise = createOcrWorker();
    // 生成に失敗したWorkerを使い回さないよう、次回呼び出しで作り直せるようにする。
    workerPromise.catch(() => { workerPromise = null; });
  }
  return workerPromise;
}

// 入渠・建造検知に備えてOCR Workerを先読みしておく（結果は待たない）
export function warmUpOcrWorker(): void {
  getWorker();
}

export async function ocr(url: string, params: Partial<WorkerParams> = { tessedit_char_whitelist: "0123456789:" }): Promise<RecognizeResult> {
  const worker = await getWorker();
  await worker.setParameters(params);
  try {
    return await worker.recognize(url);
  } catch (e) {
    // 認識自体が失敗したWorkerも壊れている可能性があるため作り直す。
    workerPromise = null;
    throw e;
  }
}
