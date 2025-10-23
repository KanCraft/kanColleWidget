# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 艦これウィジェット - プロジェクト概要

このプロジェクトは「艦これウィジェット」というChrome拡張機能です。艦隊これくしょん（艦これ）のプレイヤー向けのユーティリティツールを提供します。

## 主な機能
- 遠征・入渠・建造の通知
- 疲労度管理
- スクリーンショット機能
- ゲーム画面のリサイズ・切り抜き

## 開発環境
- TypeScript (strict mode)
- React 18 + React Router v6
- Vite (build tool)
- Tailwind CSS
- Chrome Extension Manifest V3
- Node.js v22.20.0 + pnpm 10.18.0

## 主要コマンド

### 開発・ビルド
```bash
pnpm install          # 依存関係のインストール
pnpm build            # プロダクションビルド（TypeScript → Vite）
pnpm start            # ウォッチモード（開発用）
pnpm test             # テスト実行（Vitest）
pnpm test:ui          # テストUIモード
pnpm lint             # ESLint実行
pnpm typecheck        # 型チェックのみ（ビルドなし）
```

### リリース関連
```bash
# 1. package.jsonのバージョンを手動更新
# 2. 以下を実行してmanifest.jsonとrelease-note.jsonを自動更新
make draft

# ベータ版ビルド（GitHub Actionsで自動実行）
make beta-release

# プロダクション版ビルド（GitHub Actionsで自動実行）
make release
```

詳細なリリースフローはREADME.mdの「リリースフロー」セクションを参照。

## アーキテクチャ概要

このChrome拡張は**イベント駆動型アーキテクチャ**で、以下のレイヤーで構成されています：

```
Background Service Worker (background.ts)
    ↓
Controllers (イベントルーティング)
    ↓
Services (Chrome API ラッパー)
    ↓
Models (データ永続化)
    ↓
UI Components (React + React Router)
```

### 主要ディレクトリ構造

- **`/src/background.ts`** - エントリーポイント（Service Worker）
  - 5種類のイベントリスナーを初期化：WebRequest、Alarm、Message、Notifications、Runtime
  - 30秒ごとのcronアラーム（`/cron/queues`）を起動してタイマーを監視

- **`/src/controllers/`** - イベントコントローラー（Router パターン）
  - **`WebRequest/kcsapi.ts`** - 艦これAPI通信の傍受（遠征開始、入渠開始、建造開始など）
  - **`Message.ts`** - UI↔Background間のメッセージルーティング
  - **`Alarm.ts`** - タイマーイベント処理（30秒ごとにQueueをチェック）
  - **`Notifications.ts`** - 通知クリック時の処理
  - **`Runtime.ts`** - 拡張インストール時の初期化

- **`/src/models/`** - データモデル（Chrome Storage永続化）
  - **`Queue`** - タイマーキュー（遠征、入渠、建造、疲労）
  - **`Frame`** - ゲーム窓のプリセット設定
  - **`entry/`** - 通知エントリ型（Mission、Recovery、Shipbuild、Fatigue）
  - **永続化**: `jstorm` ライブラリ経由で `chrome.storage.local` に保存

- **`/src/services/`** - Chrome API ラッパー（依存性注入可能）
  - **`Launcher`** - ゲーム窓の起動・フォーカス管理
  - **`ScriptingService`** - コンテンツスクリプト注入
  - **`PermissionsService`** - サーバーIP権限管理
  - **`CropService`** - スクリーンショットのクロッピング
  - **`DownloadService`** - ファイルダウンロード

- **`/src/page/`** - UI画面（React + React Router）
  - **`PopupPage`** - 拡張アイコンクリック時のポップアップ
  - **`DashboardPage`** - タイマー表示専用窓
  - **`OptionsPage`** - 設定画面（窓プリセット、権限管理）

- **`/src/injection/`** - コンテンツスクリプト
  - **`dmm.ts`** - DMM外部フレーム用（OCR処理、窓位置追跡）
  - **`osapi.ts`** - ゲーム内部iframe用（将来拡張用）

## 重要なアーキテクチャパターン

### 1. Router パターン（chromite ライブラリ）

すべてのイベントハンドラーで `Router` クラスを使用：

```typescript
import { Router } from "chromite";

const router = new Router<EventType>(async (event) => ({
  __action__: extractRoute(event)
}));

router.on("/path/to/route", async (event) => {
  // ハンドラー処理
});

router.onNotFound(defaultHandler);
```

**利点**: 型安全、ルーティング集約、テスト容易性

### 2. メッセージプロトコル

すべてのメッセージは以下の構造：

```typescript
{
  __action__: "/path/like/url",  // ルート識別子
  ...payload                     // アクション固有のデータ
}
```

例:
- `/frame/open-or-focus` - ゲーム窓を開く
- `/screenshot` - スクリーンショット撮影
- `/injected/dmm/ocr/{type}:result` - OCR結果の返送

### 3. API傍受フロー

```
ゲームAPIリクエスト (例: /kcsapi/api_req_mission/start)
    ↓
chrome.webRequest.onBeforeRequest イベント
    ↓
SequentialRouter (最大2並列処理)
    ↓
Controller が request body からデータ抽出
    ↓
Queue + Entry を作成、chrome.storage.local に保存
    ↓
chrome.notifications.create() で通知表示
```

### 4. タイマー管理フロー

```
Queue エントリ（scheduled = Epoch ミリ秒）
    ↓
30秒ごとの Alarm 発火
    ↓
QueueWatcher.Once() が全Queue確認
    ↓
scheduled <= 現在時刻 なら：
    ↓
    Entry.type に応じた通知メッセージ生成
    ↓
    chrome.notifications.create()
    ↓
    Queue.delete() でストレージから削除
```

### 5. OCRフロー（入渠・建造タイマー）

```
API検知 (/api_req_nyukyo/start または /api_req_kousyou/createship)
    ↓
chrome.tabs.captureVisibleTab() でスクリーンショット
    ↓
CropService で該当領域を切り出し（アスペクト比から座標計算）
    ↓
Data URL に変換
    ↓
dmm.ts にメッセージ送信
    ↓
Tesseract.js でOCR実行（ホワイトリスト: "0123456789:"）
    ↓
結果を /injected/dmm/ocr/{type}:result で返送
    ↓
Message.ts が時刻文字列をパース、Queueエントリ作成
```

## ビルド設定の重要事項

### 複数エントリーポイント（vite.config.ts）

- `background.ts` → `dist/background.js` (Service Worker)
- `page/index.html` → `dist/page/index.html` (React UI bundle)
- `injection/dmm.ts` → `dist/dmm.js` (Content Script)
- `injection/osapi.ts` → `dist/osapi.js` (Content Script)
- `*.scss` → `dist/assets/{name}.css`

### Tesseract.js の特殊処理

`pnpm run copy-tesseract` で以下をコピー：
- `node_modules/tesseract.js/dist/worker.min.js` → `src/public/tessworker.min.js`
- `node_modules/@tesseract.js-data/eng/4.0.0_best_int` → `src/public/tessdata-4.0.0_best_int`

これらは `manifest.json` の `web_accessible_resources` で公開。

### リモートコード削除

Chrome Webstore の審査対応のため、ビルド後に `pnpm run remove-remote-code` を実行：
- `dist/tessworker.min.js` と `dist/dmm.js` 内の `https://cdn.jsdelivr.net/...` を `FILTERED_BY_KCWIDGET` に置換
- Manifest V3 の Remote Code 制限に対応

## Chrome拡張固有の制約

### iframe 構造

ゲームは入れ子iframe構造：

```
DMM popup window (www.dmm.com)
  └─ iframe#game_frame
      └─ osapi.dmm.com/gadgets/ifr?...
```

`Launcher.waitForInnerIframeLoaded()` で内部iframeのロード完了を待機してからスクリプト注入。

### 通知ID規約

通知IDにメタデータをエンコード：

```
/{type}/{deck_or_dock}/{trigger}

例:
/mission/2/end     // 艦隊2の遠征完了
/recovery/1/start  // ドック1の修復開始
/shipbuild/3/end   // ドック3の建造完了
/fatigue/4/end     // 艦隊4の疲労回復
```

### Sequential API処理

```typescript
new SequentialRouter<WebRequestEvent>(2, handler)
// 最大2並列（レースコンディション防止）
```

## TypeScript 設定

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "target": "ES2020",
  "module": "ESNext",
  "moduleResolution": "bundler"
}
```

厳格な型チェックを維持。`any` の使用は最小限に。

## テスト

**現状**: テストインフラは整備済みだが、テストコードは未実装。

**推奨テスト領域**:
1. Model の CRUD（Queue、Frame）
2. Router のイベントマッチング
3. OCR時刻パース処理
4. 通知ID生成ロジック
5. Service の依存性注入
6. React コンポーネント

## コードスタイル

- **言語**: 日本語コメント推奨（プロジェクト全体で統一）
- **コミットメッセージ**: 日本語（例: `入渠タイマーのバグを修正`）
- **命名規則**:
  - クラス: PascalCase (`Queue`, `Launcher`)
  - 関数: camelCase (`onMessage`, `listener`)
  - 定数: UPPER_SNAKE_CASE（環境変数など）

## Claude Code 使用時の重要な指示

### 診断チェックの必須実行

ファイルを作成・編集した後は、**必ず** `mcp__ide__getDiagnostics` ツールを使用して診断情報を確認すること。

- **タイミング**: Edit、Write、NotebookEdit ツールを使用した直後
- **目的**: 構文エラー、型エラー、lintエラーを即座に検出して修正
- **方法**:
  ```
  mcp__ide__getDiagnostics({ uri: "file:///<absolute-path-to-file>" })
  ```
- **対応**: 診断結果にエラーや警告がある場合は、ユーザーに報告する前に修正を試みること

**例**:
```typescript
// YAMLファイルを編集した後
await edit(".github/workflows/example.yaml", ...);
// 必ず診断チェックを実行
const diagnostics = await getDiagnostics({
  uri: "file:///Users/.../example.yaml"
});
// エラーがあれば即座に修正
if (diagnostics.length > 0) {
  // 修正処理...
}
```

この手順により、ユーザーに提示する前にコード品質を保証できる。

## 注意事項

- Chrome拡張機能の権限設定に注意（manifest.json の `permissions` と `optional_host_permissions`）
- 艦これのAPI通信を監視するため `webRequest` 権限を使用
- ゲームサーバーIPは `optional_host_permissions` で、ユーザーが個別に許可
- Manifest V3 では Service Worker が idle 時に停止するため、永続的なグローバル変数は使用不可
- Storage は `chrome.storage.local` 経由のみ（`localStorage` は Service Worker で使用不可）
