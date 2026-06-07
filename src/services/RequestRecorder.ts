import { Logger } from "../logger";

const log = Logger.get("RequestRecorder");

/**
 * kcsapi リクエスト Recorder（ローカル開発専用の可観測性機能）。
 *
 * 背景: 艦これウィジェットの検知ロジックは、艦これ API のリバースエンジニアリングによる
 * 「シーケンス（特定リクエストの連続）＝この出来事」という仮説で組まれている。その仮説を
 * 観測で検証／反証できるよう、実ゲームで流れる kcsapi 全リクエストを記録する。
 * @see https://github.com/KanCraft/kanColleWidget/issues/1790
 *
 * 設計:
 *  - Chrome Native Messaging で `scripts/request-recorder-host.mjs` へリクエストを流し、
 *    host 側が JSONL ファイルに追記する。コーディングエージェントはその JSONL を必要時に
 *    読む（セッションをブロックしない）。
 *  - 有効化は build-manifest.ts の dev 限定 `nativeMessaging` 権限注入と一対。実行時は
 *    manifest に権限があるか（= dev ビルドか）で判定するので、beta / prod では無効になる。
 *  - 送信は fire-and-forget。host 未起動・送信失敗はすべて握りつぶし、ゲーム機能の傍受
 *    フローを絶対に止めない（非ブロッキング）。
 */

/** native messaging host 名（scripts/install-recorder-host.mjs が登録する host manifest と一致させる）。 */
export const NATIVE_HOST_NAME = "com.kancraft.kancollewidget.recorder";

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

export class RequestRecorder {
  /** 遅延接続する native messaging ポート。SW 揮発・host 切断時は null に戻して再接続する。 */
  private static port: chrome.runtime.Port | null = null;

  /**
   * Recorder を有効化すべきか。dev チャンネルのビルドだけ manifest に nativeMessaging 権限が
   * 注入されている（build-manifest.ts 参照）ので、それを単一の真実源にする。
   */
  static enabled(): boolean {
    try {
      return chrome.runtime.getManifest().permissions?.includes("nativeMessaging") ?? false;
    } catch {
      return false;
    }
  }

  /** native host への接続を取得（無ければ張る）。失敗時は null を返し、呼び出し側は握りつぶす。 */
  private static connect(): chrome.runtime.Port | null {
    if (this.port) return this.port;
    try {
      const port = chrome.runtime.connectNative(NATIVE_HOST_NAME);
      port.onDisconnect.addListener(() => {
        // host 未起動・クラッシュ時はここに来る。次回送信時に再接続させる。
        if (chrome.runtime.lastError) log.debug("native host disconnected", chrome.runtime.lastError.message);
        this.port = null;
      });
      this.port = port;
      return port;
    } catch (err) {
      log.debug("connectNative failed", err);
      return null;
    }
  }

  /** 1 レコードを native host へ送る。fire-and-forget。失敗は握りつぶす。 */
  private static send(record: RecordedRequest): void {
    try {
      const port = this.connect();
      port?.postMessage(record);
    } catch (err) {
      // host 未起動などで postMessage が投げても、ゲーム機能を止めない。
      log.debug("failed to post record to native host", err);
      this.port = null;
    }
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
