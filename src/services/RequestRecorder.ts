import { Logger } from "../logger";

const log = Logger.get("RequestRecorder");

/**
 * kcsapi リクエスト Recorder（ローカル開発専用の可観測性機能）。
 *
 * 背景: 艦これウィジェットの検知ロジックは、艦これ API のリバースエンジニアリングによる
 * 「シーケンス（特定リクエストの連続）＝この出来事」という仮説で組まれている。その仮説を
 * 観測で検証／反証できるよう、実ゲームで流れる kcsapi 全リクエストを記録する。
 * @see https://github.com/KanCraft/kanColleWidget/issues/1790
 * @see https://github.com/KanCraft/kanColleWidget/issues/1793
 *
 * 設計（transport = localhost dev サーバ / #1793）:
 *  - マスク済みレコードを `http://127.0.0.1:<port>/record` へ fetch POST する。受け側の
 *    サーバ（`scripts/request-recorder-server.mjs`）は開発者が `pnpm start`(too) で起動し、
 *    受信レコードを stdout に出し JSONL に追記する。Chrome ではなく開発者がサーバを起動する
 *    ので、Chrome の最小 PATH ギャップも too 出力への不可視も起きない。
 *  - payload には `chrome.runtime.id`（ext_id）を含める。サーバ側はこれで送信元拡張を識別
 *    できる（Native Messaging の allowed_origins を使わないので登録作業ゼロ・冪等）。
 *  - 有効化は build-manifest.ts の dev 限定 host_permission 注入と一対。実行時は manifest に
 *    その host_permission があるか（= dev ビルドか）で判定するので、beta / prod では無効。
 *  - 送信は fire-and-forget。サーバ未起動・失敗はすべて握りつぶし、ゲーム機能の傍受フローを
 *    絶対に止めない（非ブロッキング）。
 */

/** recorder サーバの既定ポート（サーバ側 KCW_RECORDER_PORT の既定値と一致させること）。 */
export const RECORDER_PORT = 8799;

/** レコード送信先 URL。 */
export const RECORDER_URL = `http://127.0.0.1:${RECORDER_PORT}/record`;

/**
 * dev 限定で注入される host_permission（build-manifest.ts と一致させる）。
 * これを実行時の有効化フラグの単一の真実源にする（beta/prod には注入されない）。
 */
export const LOCALHOST_PERMISSION = "http://127.0.0.1/*";

/** マスク対象の機密フィールド（認証トークン・個人識別子）。 */
export const MASK_KEYS = ["api_token", "api_serial_cid", "api_verno"];

/** マスク後に入る値。「マスクされた」とひと目で分かる固定文字列。 */
export const MASK_VALUE = "***MASKED***";

/** 1 リクエストを記録するレコード。 */
export interface RecordedRequest {
  timestamp: number;
  path: string;
  method: string;
  tabId: number;
  frameId: number;
  formData: Record<string, unknown>;
}

/** サーバへ POST する payload（レコード + 送信元拡張 ID）。 */
export interface RecorderPayload extends RecordedRequest {
  extId: string;
}

/** chrome.webRequest の formData は `{ key: string[] }` 形。 */
type FormData = Record<string, unknown>;

/**
 * formData から機密フィールドをマスクした新しいオブジェクトを返す純粋関数。
 * 元オブジェクトは破壊しない。マスクしたキーは値を MASK_VALUE に置換するだけで残すので、
 * 「何かはあったが伏せた」が後から分かる。
 */
export function maskFormData(formData: FormData | undefined | null): Record<string, unknown> {
  if (!formData) return {};
  const masked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(formData)) {
    masked[key] = MASK_KEYS.includes(key) ? MASK_VALUE : value;
  }
  return masked;
}

/**
 * webRequest の詳細から記録レコードを組み立てる純粋関数。
 * formData はマスク済み。path は URL の pathname（例 `/kcsapi/api_req_map/start`）。
 */
export function buildRecord(
  details: chrome.webRequest.OnBeforeRequestDetails,
  timestamp: number,
): RecordedRequest {
  let path = details.url;
  try {
    path = new URL(details.url).pathname;
  } catch {
    // URL パースに失敗しても記録は止めない（生 URL のまま残す）
  }
  return {
    timestamp,
    path,
    method: details.method,
    tabId: details.tabId,
    frameId: details.frameId,
    formData: maskFormData(details.requestBody?.formData as FormData | undefined),
  };
}

/** レコードに送信元拡張 ID を付けて POST payload にする純粋関数（ext_id ping）。 */
export function buildPayload(record: RecordedRequest, extId: string): RecorderPayload {
  return { ...record, extId };
}

export class RequestRecorder {
  /**
   * Recorder を有効化すべきか。dev チャンネルのビルドだけ manifest に localhost host_permission
   * が注入されている（build-manifest.ts 参照）ので、それを単一の真実源にする。
   */
  static enabled(): boolean {
    try {
      return chrome.runtime.getManifest().host_permissions?.includes(LOCALHOST_PERMISSION) ?? false;
    } catch {
      return false;
    }
  }

  /** 1 レコードを localhost サーバへ送る。fire-and-forget。失敗は握りつぶす（非ブロッキング）。 */
  private static send(record: RecordedRequest): void {
    const payload = buildPayload(record, chrome.runtime.id);
    // await しない。サーバ未起動・ネットワーク失敗は .catch で握りつぶし、傍受フローを止めない。
    fetch(RECORDER_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    }).catch((err) => {
      log.debug("failed to POST record to recorder server", err);
    });
  }

  /**
   * chrome.webRequest.onBeforeRequest 用のリスナーを返す。
   * 既存ルーター（onBeforeRequest）とは独立に登録し、ハンドルされない kcsapi も含めて全件記録する。
   */
  static listener() {
    return (details: chrome.webRequest.OnBeforeRequestDetails): chrome.webRequest.BlockingResponse | undefined => {
      try {
        this.send(buildRecord(details, Date.now()));
      } catch (err) {
        // 記録は副作用。何があってもリクエスト処理を妨げない。
        log.debug("failed to record request", err);
      }
      // 非 blocking で登録するため常に undefined を返す（リクエストには介入しない）。
      return undefined;
    };
  }
}
