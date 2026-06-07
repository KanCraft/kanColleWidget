#!/usr/bin/env node

/**
 * kcsapi リクエスト Recorder の Native Messaging host を OS に登録するヘルパ
 * （ローカル開発専用 / #1790）。
 *
 * 使い方:
 *   node scripts/install-recorder-host.mjs <EXTENSION_ID>
 *
 * <EXTENSION_ID> は chrome://extensions で「デベロッパーモード」をオンにして dev ビルド
 * (KCW_CHANNEL=dev、艦これウィジェット_DEV) を「パッケージ化されていない拡張機能を読み込む」
 * で読み込んだときに表示される ID。
 *
 * このスクリプトは host manifest を Chrome の NativeMessagingHosts ディレクトリに書き込み、
 * host 本体(request-recorder-host.mjs)へ実行権限を付与する。
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// src/services/RequestRecorder.ts の NATIVE_HOST_NAME と一致させること。
const NATIVE_HOST_NAME = "com.kancraft.kancollewidget.recorder";

const extensionId = process.argv[2];
if (!extensionId || !/^[a-p]{32}$/.test(extensionId)) {
  console.error("usage: node scripts/install-recorder-host.mjs <EXTENSION_ID>");
  console.error("  <EXTENSION_ID> は chrome://extensions に表示される 32 文字の ID");
  process.exit(1);
}

const hostScript = path.join(__dirname, "request-recorder-host.mjs");
// Chrome は manifest の `path` を実行可能ファイルとして起動する。shebang 付きスクリプトに
// 実行権限を与えて直接起動させる。
fs.chmodSync(hostScript, 0o755);

const manifest = {
  name: NATIVE_HOST_NAME,
  description: "kanColleWidget kcsapi request recorder (local dev only)",
  path: hostScript,
  type: "stdio",
  allowed_origins: [`chrome-extension://${extensionId}/`],
};

/** OS ごとの Chrome NativeMessagingHosts ディレクトリを返す。 */
function manifestDir() {
  const home = os.homedir();
  switch (process.platform) {
  case "darwin":
    return path.join(home, "Library", "Application Support", "Google", "Chrome", "NativeMessagingHosts");
  case "linux":
    return path.join(home, ".config", "google-chrome", "NativeMessagingHosts");
  default:
    return null;
  }
}

const dir = manifestDir();
if (!dir) {
  console.error(`このスクリプトは macOS / Linux のみ自動対応です（platform=${process.platform}）。`);
  console.error("Windows ではレジストリ登録が必要です。下記 manifest を任意の場所に保存し、");
  console.error(`HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${NATIVE_HOST_NAME} にパスを登録してください:`);
  console.error(JSON.stringify(manifest, null, 2));
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });
const dest = path.join(dir, `${NATIVE_HOST_NAME}.json`);
fs.writeFileSync(dest, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`[install-recorder-host] host manifest を書き込みました: ${dest}`);
console.log(`[install-recorder-host] host 本体: ${hostScript}`);
console.log("[install-recorder-host] Chrome を再起動すると有効になります。");
console.log("[install-recorder-host] 記録先(既定): <repo>/.recorder/kcsapi.jsonl（KCW_RECORDER_OUTFILE で変更可）");
