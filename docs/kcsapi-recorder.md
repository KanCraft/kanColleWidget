---
kind: guide
---

# kcsapi リクエスト Recorder（ローカル開発専用）

実ゲームで流れる kcsapi の全リクエストを記録し、コーディングエージェントが解析できるようにする。検知ロジックは「特定のリクエスト列＝この出来事」という未検証の仮説で組まれているので、それを観測で確かめるための道具（#1790 / #1793）。dev ビルドにだけ入り、beta / prod には含まれない。

## 使い方

1. `pnpm start` を実行する。`too` が vite の watch ビルドと recorder サーバ（`scripts/request-recorder-server.mjs`）を並走させる。サーバの stdout がそのまま live feed になる。
2. `chrome://extensions` でデベロッパーモードを ON にし、`dist/` を「パッケージ化されていない拡張機能を読み込む」で読み込む（名前は「艦これウィジェット_DEV」）。
3. 艦これをプレイすると、リクエストがサーバに POST され、`.recorder/kcsapi.jsonl` に 1 行ずつ追記される。
4. エージェントは `.recorder/kcsapi.jsonl` を読んで解析する。

ポートの既定は `8799`（`RequestRecorder.RECORDER_PORT`）。サーバ側は `KCW_RECORDER_PORT` でポートを、`KCW_RECORDER_OUTFILE` で出力先を変えられる。ポートを変えるときは拡張側の定数も合わせる。

## 仕組み

- `src/services/RequestRecorder.ts` が既存のルーターとは別に `onBeforeRequest` へ登録し、全 kcsapi を拾う。`fetch` で `http://127.0.0.1:<port>/record` へ送り、失敗は握りつぶす。記録は副作用で、ゲーム機能の傍受を止めない。
- dev 限定の真実源は 1 つだけ。`scripts/build-manifest.ts` が `channel === "dev"` のときだけ `http://127.0.0.1/*` を host_permissions に入れ、`RequestRecorder.enabled()` は実行時にその有無で判定する。`src/background.ts` は `enabled()` が真のときだけ listener を登録する。
- `api_token` / `api_serial_cid` / `api_verno` は値を `***MASKED***` に置き換える。キーは残すので「何かあったが伏せた」ことは分かる。純粋関数は `tests/request-recorder.spec.ts` が固定している。
- レスポンスボディは MV3 の制約で取れない。

## なぜ Native Messaging をやめたか（#1793）

Native Messaging は host manifest の `allowed_origins` に拡張 ID の完全一致を要求する（ワイルドカード不可）。そのため、拡張 ID の手動コピー、unpacked 拡張の ID が決まらないことによる非冪等、Chrome が host を最小 PATH で起動することによる PATH の食い違いと `too` 出力への不可視、が起きた。localhost サーバ方式はどれも起きない。
