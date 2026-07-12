import { Logger } from "../../logger";

const log = Logger.get("WebRequest");

// webRequest details から formData を型付きで取り出す。
// chrome の型 ({ [key: string]: string[] }) から API ごとの FormData 型への
// アサーションをここに集約する。requestBody が欠落しているリクエストでは
// warn ログを残して undefined を返すので、呼び出し側は early return すること。
export function formData<T>(details: chrome.webRequest.OnBeforeRequestDetails): T | undefined {
  const data = details.requestBody?.formData;
  if (!data) {
    log.warn("formData がありません", details.url, details);
    return undefined;
  }
  return data as unknown as T;
}
