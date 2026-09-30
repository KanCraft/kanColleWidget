# 必ず尊重すること

保守性・拡張性・可読性を重視する。単一責任の原則に則り、変更しやすく、置換しやすく、理解しやすい設計を徹底する。多少冗長になっても、責務分離の観点からなるべくシンプルかつエレガントな設計になるよう心がける。

設計判断の前に [`docs/constitution.md`](docs/constitution.md)（憲章）を読むこと。

# 最重要な指示

- Premature Optimization is the Root of All Evil
- 一切忖度しないこと
- 常に日本語を利用すること
- 絵文字を使わないこと
- 可読性と保守性を最優先すること
- コメントは日本語で書くこと
- 許可がない限り、このAGENTS.mdは更新しないこと

## レビューについて

- レビューはかなり厳しくすること
- レビューの表現は、シンプルにすること
- レビューの表現は、日本語で行うこと
- レビューの表現は、指摘内容を明確にすること
- レビューの表現は、指摘内容を具体的にすること
- レビューの表現は、指摘内容を優先順位をつけること
- レビューの表現は、指摘内容を優先順位をつけて、重要なものから順に記載すること
- ドキュメントは別に書いているので、ドキュメトに付いては考慮しないこと
- 変更点とリリースノートの整合性を確認すること

# 艦これウィジェット

艦隊これくしょん（艦これ）のプレイヤー向け Chrome 拡張（Manifest V3）。遠征・入渠・建造・疲労のタイマーと通知、ゲーム窓の起動とリサイズ、スクリーンショット、大破進撃防止窓を提供する。TypeScript（strict）、React + React Router、Vite、Tailwind CSS、Vitest。Node と pnpm の版は `package.json` の `engines` に従う。

## コマンド

```bash
pnpm install          # 依存関係のインストール
pnpm build            # プロダクションビルド（tsc → copy-tesseract → vite）
pnpm start            # ウォッチビルドと kcsapi Recorder サーバを並走（docs/kcsapi-recorder.md）
pnpm test             # Vitest（ウォッチ。1 回だけなら pnpm exec vitest run）
pnpm lint             # ESLint（警告 0 件が条件）
pnpm typecheck        # 型チェックのみ
```

## リリース

- バージョンの単一の真実源は `package.json` の `version`。上げるのは `make version v=X.Y.Z` だけ（`release-note.json` の未公開エントリも再生成される）。`manifest.json` はビルド時に生成される成果物なので直接編集しない（編集するのは `src/public/manifest.template.json`）。
- BETA は、version が直近タグより先行している間、毎朝 06:30 JST の定期実行（`.github/workflows/release-beta.yaml`）で自動公開される。急ぐときは同ワークフローを `workflow_dispatch` で手動実行する。
- 本番は GitHub Release を作ると `release-prod.yaml` が走る（`gh release create vX.Y.Z --generate-notes`）。
- 手順の詳細は `.claude/skills/release/SKILL.md` と README.md の「リリースフロー」。

## 構成

イベント駆動。`src/background.ts`（Service Worker）が各 Chrome イベントを `src/controllers/` のルーター（chromite の `Router`）へ流し、コントローラが `src/services/`（Chrome API ラッパー）と `src/models/`（jstorm で `chrome.storage.local` に永続化）を使う。UI は `src/page/`（React）、ゲーム窓への注入は `src/injection/`（`dmm.ts` は外側、`osapi.ts` はゲーム iframe）。

- メッセージは `{ __action__: "/path/like/url", ...payload }` の形で、ルート名は `src/messages.ts` にまとめる。
- 艦これ API の傍受は `SequentialRouter`（最大 2 並列）で処理し、競合を防ぐ。
- タイマーは Queue（`scheduled` は epoch ミリ秒）に積み、30 秒ごとのアラームで `QueueWatcher` が確認して通知する。
- 入渠・建造の残り時間は、API 検知時に画面を撮影して切り抜き、ゲーム窓の content script で Tesseract.js による OCR をして得る。
- Chrome Web Store の審査対応のため、ビルド後に `pnpm run remove-remote-code` で CDN への参照を潰す。

### 通知ID規約

通知 ID は `/{type}/{trigger}/{target}`（例: `/mission/end/2`、`/mission/remind/3`、`/recovery/start/1`）。設定レコードのキーは `/{type}/{trigger}`。回収時などの消去処理はこの形式への前方・後方一致に依存しているので、形式を変えない。実装は `src/models/entry/NotificationId.ts`、契約は `tests/notification-id.spec.ts` が固定している。

## MV3 の制約

- Service Worker は idle で止まるので、永続的なグローバル変数を使わない。
- `localStorage` は Service Worker で使えない。ストレージは `chrome.storage.local`（一時的なものは `chrome.storage.session`）。
- `scripting.executeScript` で注入したスクリプトはリロードで消える（docs/history/20260604_game-window-resize-on-reload.md）。

## コード規約

- コメントは日本語。コミットメッセージは日本語の平文（例: `遠征の帰投予告通知を追加する (#935)`）。
- クラスは PascalCase、関数は camelCase、定数は UPPER_SNAKE_CASE。
- `any` は最小限にする。
- テストは `tests/` に kebab-case の `*.spec.ts(x)` で置く。
- 文書の置き場は `docs/README.md` に従う。
