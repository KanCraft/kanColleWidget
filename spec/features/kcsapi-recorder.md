# Feature Specification: kcsapi リクエスト Recorder（ローカル開発専用）

**対象 Issue**: #1790 艦これ API リクエストの可観測性基盤を導入する（kcsapi Recorder の最小実装から）

## 目的

艦これウィジェットの検知ロジックは、艦これ API のリバースエンジニアリングによる
「シーケンス（特定リクエストの連続）＝この出来事」という**検証されていない仮説**で
組まれている。その仮説を観測で検証／反証できるよう、実ゲームで流れる **kcsapi 全リクエストを
記録**し、コーディングエージェント（Claude Code 等）が解析できるようにする。

本機能は**ローカル開発専用**であり、beta / prod 成果物には一切含まれない。

## アーキテクチャ

```
Service Worker (background.ts)
  └─ RequestRecorder.listener()  ← 既存ルーターと独立に onBeforeRequest へ登録（全 kcsapi を捕捉）
       └─ buildRecord(): マスク済みレコードを生成
       └─ connectNative(NATIVE_HOST_NAME) で host へ fire-and-forget 送信（非ブロッキング）
            ↓ Chrome Native Messaging (stdio)
scripts/request-recorder-host.mjs (node native host)
  └─ 受信レコードを JSONL に 1 行ずつ追記
            ↓
.recorder/kcsapi.jsonl  ← コーディングエージェントが tail / 読み取りして解析
```

## 関連モジュール

- `src/services/RequestRecorder.ts` — `maskFormData` / `buildRecord`（純粋関数）、`enabled()`、`listener()`。
- `src/background.ts` — `RequestRecorder.enabled()` が真のときだけ Recorder listener を登録。
- `scripts/build-manifest.ts` — `composeManifest` が `channel==="dev"` のときだけ `nativeMessaging` 権限を注入。
- `scripts/request-recorder-host.mjs` — native messaging host 本体（JSONL 追記）。
- `scripts/install-recorder-host.mjs` — host manifest を OS に登録するヘルパ。

## dev 限定の仕組み（単一の真実源）

`nativeMessaging` 権限は **dev チャンネルのビルドにだけ** 注入される
（`build-manifest.ts`）。`RequestRecorder.enabled()` は実行時に
`chrome.runtime.getManifest().permissions` にその権限が在るかで判定するため、
beta / prod では Recorder が登録されず無効になる。ビルド時の注入と実行時の有効化が
1 つの事実（権限の有無）で連動する。

## 記録レコード

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
    "api_mapinfo_no": ["1"],
    "api_token": "***MASKED***",
    "api_verno": "***MASKED***"
  }
}
```

マスク対象: `api_token` / `api_serial_cid` / `api_verno`（`MASK_KEYS`）。
値を `***MASKED***` に置換するだけで**キー自体は残す**ので「何かはあったが伏せた」が分かる。

## 有効化手順（開発者・エージェント向け）

1. dev ビルドを作る（`pnpm start` または `pnpm build`。どちらも `KCW_CHANNEL` 既定 = dev）。
2. `chrome://extensions` でデベロッパーモードを ON にし、`dist/` を「パッケージ化されていない
   拡張機能を読み込む」で読み込む（名前は「艦これウィジェット_DEV」）。表示される 32 文字の
   拡張 ID を控える。
3. host を OS に登録する:
   ```bash
   node scripts/install-recorder-host.mjs <EXTENSION_ID>
   ```
4. Chrome を再起動する。
5. 艦これをプレイすると、kcsapi リクエストが `.recorder/kcsapi.jsonl` に追記される
   （出力先は環境変数 `KCW_RECORDER_OUTFILE` で変更可）。
6. エージェントは `.recorder/kcsapi.jsonl` を読んで解析する（セッションをブロックしない）。

`pnpm start` は [`too`](https://github.com/otiai10/too.js)（`tee` の逆 — 複数プロセスの
stdout/stderr を 1 フォアグラウンドに束ね、1 回の Ctrl+C で全停止）で **vite watch ビルドと
`.recorder/kcsapi.jsonl` の `tail -f` を並走**させる。これにより開発者は 1 コマンドで
「拡張のホットビルド＋流れてくる kcsapi リクエストのライブ表示」を得られ、Ctrl+C で両方畳める。

## 非ブロッキング保証

native host が未起動・クラッシュしても、送信は `try/catch` で握りつぶされ、ポートは次回
再接続のため null に戻る。記録は副作用であり、ゲーム機能の傍受フローを止めない。

## スコープ外（将来 Issue）

- 「API シーケンス ↔ 検知ケース ↔ 期待アクション」対応表の作成。
- 既存 `spec/features/*.md` への「このケースはこのリクエスト列」紐づけ。
- 記録ログのフィクスチャ化・リプレイ検証基盤。
- レスポンスボディの取得（MV3 制約）。
- 本番でのテレメトリ送信。
