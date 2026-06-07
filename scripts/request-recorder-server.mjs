#!/usr/bin/env node

/**
 * kcsapi リクエスト Recorder の localhost dev サーバ（ローカル開発専用 / #1793）。
 *
 * 拡張(src/services/RequestRecorder.ts)が `http://127.0.0.1:<port>/record` へ POST してくる
 * kcsapi リクエストを受け取り、stdout に出力（= live feed）し、JSONL ファイルへ 1 行ずつ
 * 追記する。コーディングエージェントはその JSONL を必要時に読む。
 *
 * 開発者が `pnpm start`(too) で起動する想定。Chrome ではなくシェルから起動されるので
 * PATH ギャップは起きず、サーバ自身の stdout が too の出力にそのまま流れる。
 *
 * 設定:
 *   KCW_RECORDER_PORT     listen ポート（既定 8799。RequestRecorder.RECORDER_PORT と一致）
 *   KCW_RECORDER_OUTFILE  出力 JSONL（既定 <repo>/.recorder/kcsapi.jsonl）
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const port = Number(process.env.KCW_RECORDER_PORT) || 8799;
const outfile = process.env.KCW_RECORDER_OUTFILE
  ? path.resolve(process.env.KCW_RECORDER_OUTFILE)
  : path.join(repoRoot, ".recorder", "kcsapi.jsonl");

fs.mkdirSync(path.dirname(outfile), { recursive: true });
const out = fs.createWriteStream(outfile, { flags: "a" });

const server = http.createServer((req, res) => {
  // 拡張は host_permission 経由で CORS 不要だが、念のため許可ヘッダを付ける。
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  if (req.method === "OPTIONS") {
    res.writeHead(204).end();
    return;
  }
  if (req.method !== "POST" || !req.url || !req.url.startsWith("/record")) {
    res.writeHead(404).end();
    return;
  }

  let body = "";
  req.on("data", (chunk) => { body += chunk; });
  req.on("end", () => {
    try {
      const record = JSON.parse(body);
      out.write(`${JSON.stringify(record)}\n`);
      // live feed: 受信を 1 行で stdout に出す（too の出力に流れる）。
      // 送信元拡張を頭にラベル表示して grep しやすくする: `[ext:xxxxxxxx] POST /kcsapi/...`
      const label = record.extId ? `[ext:${record.extId.slice(0, 8)}]` : "[recorder]";
      process.stdout.write(`${label} ${record.method ?? "?"} ${record.path ?? "?"}\n`);
      res.writeHead(204).end();
    } catch (err) {
      process.stderr.write(`[recorder] failed to parse body: ${err}\n`);
      res.writeHead(400).end();
    }
  });
});

server.on("error", (err) => {
  process.stderr.write(`[recorder] server error: ${err}\n`);
  process.exit(1);
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`[recorder] listening on http://127.0.0.1:${port}/record → ${outfile}\n`);
});
