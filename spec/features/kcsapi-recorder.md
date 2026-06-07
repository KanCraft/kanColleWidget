# Feature Specification: kcsapi リクエスト Recorder（ローカル開発専用）

**対象 Issue**: #1790（基盤導入）/ #1793（transport を localhost dev サーバに切り替え）

## 目的

艦これウィジェットの検知ロジックは、艦これ API のリバースエンジニアリングによる
「シーケンス（特定リクエストの連続）＝この出来事」という**検証されていない仮説**で
組まれている。その仮説を観測で検証／反証できるよう、実ゲームで流れる **kcsapi 全リクエストを
記録**し、コーディングエージェント（Claude Code 等）が解析できるようにする。

本機能は**ローカル開発専用**であり、beta / prod 成果物には一切含まれない。

## アーキテクチャ（transport = localhost dev サーバ / #1793）

```
Service Worker (background.ts)
  └─ RequestRecorder.listener()  ← 既存ルーターと独立に onBeforeRequest へ登録（全 kcsapi を捕捉）
       └─ buildRecord(): マスク済みレコードを生成
       └─ buildPayload(): chrome.runtime.id(extId) を付与（ext_id ping）
       └─ fetch POST http://127.0.0.1:<port>/record（fire-and-forget・非ブロッキング）
            ↓ HTTP
scripts/request-recorder-server.mjs (node, 開発者が pnpm start/too で起動)
  └─ 受信レコードを stdout に出力（= live feed）し、.recorder/kcsapi.jsonl に追記
            ↓
.recorder/kcsapi.jsonl  ← コーディングエージェントが読み取って解析
```

**なぜ Native Messaging をやめたか（#1793）**: Native Messaging は host manifest の
`allowed_origins` に拡張 ID の完全一致列挙を要求する（ワイルドカード不可）ため、
(1) ext_id の手動コピー、(2) unpacked 拡張 ID の非決定性による非冪等、(3) Chrome が host を
最小 PATH で spawn することによる PATH ギャップと `too` 出力への不可視、を招いた。
localhost サーバ方式は `allowed_origins` を使わないのでこれらが全て解消し、サーバは開発者が
シェルから起動するので PATH 問題も無く、サーバ stdout がそのまま live feed になる。

## 関連モジュール

- `src/services/RequestRecorder.ts` — `maskFormData` / `buildRecord` / `buildPayload`（純粋関数）、`enabled()`、`listener()`。送信は `fetch` POST。
- `src/background.ts` — `RequestRecorder.enabled()` が真のときだけ Recorder listener を登録。
- `scripts/build-manifest.ts` — `composeManifest` が `channel==="dev"` のときだけ `http://127.0.0.1/*` を host_permissions に注入。
- `scripts/request-recorder-server.mjs` — localhost dev サーバ本体（stdout 出力 + JSONL 追記）。

## dev 限定の仕組み（単一の真実源）

`http://127.0.0.1/*` の host_permission は **dev チャンネルのビルドにだけ** 注入される
（`build-manifest.ts`）。`RequestRecorder.enabled()` は実行時に
`chrome.runtime.getManifest().host_permissions` にその項目が在るかで判定するため、
beta / prod では Recorder が登録されず無効になる。ビルド時の注入と実行時の有効化が
1 つの事実で連動する。

## 記録レコード / 送信 payload

```jsonc
{
  "timestamp": 1717718400000,        // 受信時刻(epoch ms)
  "path": "/kcsapi/api_req_map/start",
  "method": "POST",
  "tabId": 123,
  "frameId": 0,
  "formData": {                       // 機密フィールドはマスク済み
    "api_deck_id": ["1"],
    "api_maparea_id": ["1"],
    "api_token": "***MASKED***",
    "api_verno": "***MASKED***"
  },
  "extId": "abcdefghijklmnopabcdefghijklmnop"  // chrome.runtime.id（ext_id ping）
}
```

マスク対象: `api_token` / `api_serial_cid` / `api_verno`（`MASK_KEYS`）。
値を `***MASKED***` に置換するだけで**キー自体は残す**ので「何かはあったが伏せた」が分かる。

## 有効化手順（開発者・エージェント向け）

1. `pnpm start` を実行する（`too` が **vite watch ビルド** と **recorder サーバ
   （`scripts/request-recorder-server.mjs`）** を並走起動。サーバの stdout が live feed）。
2. `chrome://extensions` でデベロッパーモードを ON にし、`dist/` を「パッケージ化されていない
   拡張機能を読み込む」で読み込む（名前は「艦これウィジェット_DEV」）。
3. 艦これをプレイすると、kcsapi リクエストがサーバに POST され、`too` の出力に live 表示され、
   `.recorder/kcsapi.jsonl` に追記される。
4. エージェントは `.recorder/kcsapi.jsonl` を読んで解析する。

**OS への登録作業・拡張 ID の手動コピーは不要**（Native Messaging 廃止により）。
ポートは既定 `8799`（`RequestRecorder.RECORDER_PORT`）。サーバ側は `KCW_RECORDER_PORT` /
出力先は `KCW_RECORDER_OUTFILE` で変更可（ポートを変える場合は拡張側定数も合わせること）。

`too`（[otiai10/too.js](https://github.com/otiai10/too.js)）は `tee` の逆で、複数プロセスの
stdout/stderr を 1 フォアグラウンドに束ね、1 回の Ctrl+C で全停止する。

## 非ブロッキング保証

recorder サーバが未起動・失敗しても、送信は `fetch(...).catch(...)` で握りつぶされる。
記録は副作用であり、ゲーム機能の傍受フローを止めない。

## セキュリティ

サーバは `127.0.0.1` バインドの dev 専用。host_permission も dev ビルドのみに注入され、
beta / prod 成果物には含まれない。

## スコープ外（将来 Issue）

- 「API シーケンス ↔ 検知ケース ↔ 期待アクション」対応表の作成。
- 既存 `spec/features/*.md` への「このケースはこのリクエスト列」紐づけ。
- 記録ログのフィクスチャ化・リプレイ検証基盤。
- レスポンスボディの取得（MV3 制約）。
- 本番でのテレメトリ送信。
