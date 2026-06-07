#!/usr/bin/env node

/**
 * kcsapi リクエスト Recorder の Chrome Native Messaging host（ローカル開発専用 / #1790）。
 *
 * 拡張(src/services/RequestRecorder.ts)が connectNative で流してくる kcsapi リクエストを
 * 受け取り、JSONL ファイルへ 1 行ずつ追記する。コーディングエージェントはその JSONL を
 * 必要時に tail / 読み取りして「ケース ↔ リクエスト列」の解析に使う。
 *
 * Chrome Native Messaging の stdio プロトコル:
 *   各メッセージ = 4 byte の符号なし整数(プラットフォームのネイティブバイトオーダ。実質
 *   リトルエンディアン)の長さ prefix + その長さ分の UTF-8 JSON 本体。
 *
 * 出力先:
 *   環境変数 KCW_RECORDER_OUTFILE があればそれを、無ければ <repo>/.recorder/kcsapi.jsonl。
 *   host manifest の `path` から起動されるため cwd は不定。既定はこのスクリプト位置基準で解決する。
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const outfile = process.env.KCW_RECORDER_OUTFILE
  ? path.resolve(process.env.KCW_RECORDER_OUTFILE)
  : path.join(repoRoot, ".recorder", "kcsapi.jsonl");

fs.mkdirSync(path.dirname(outfile), { recursive: true });
const out = fs.createWriteStream(outfile, { flags: "a" });

let buffer = Buffer.alloc(0);

process.stdin.on("data", (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  // バッファに「長さ prefix + 本体」が揃っている限り取り出して処理する。
  for (;;) {
    if (buffer.length < 4) break;
    const length = buffer.readUInt32LE(0);
    if (buffer.length < 4 + length) break;
    const body = buffer.subarray(4, 4 + length);
    buffer = buffer.subarray(4 + length);
    try {
      // 受信した JSON をそのまま 1 行(JSONL)として追記する。
      const record = JSON.parse(body.toString("utf8"));
      out.write(`${JSON.stringify(record)}\n`);
    } catch (err) {
      // 壊れたメッセージで host を落とさない。
      process.stderr.write(`[recorder-host] failed to parse message: ${err}\n`);
    }
  }
});

// Chrome が拡張(またはポート)を閉じると stdin が EOF になる。素直に終了する。
process.stdin.on("end", () => {
  out.end(() => process.exit(0));
});
