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

# Repository Guidelines

以下の項目は、今後変更しうるため、現時点での目安と考えること

## プロジェクト構成とモジュール運用
本リポジトリ は 艦これウィジェット Chrome 拡張 を 管理 します。主コード は `src/`、UI は `src/components/`、状態 や サービス は `src/features/` に 置きます。テスト は `tests/`、ビルド成果 は `dist/` に 保存 します。進行 セッション は `sessions/`、完了 記録 は `archived_sessions/` と `log/` に 移し、MCP ツール は `mcp/`、エディタ 設定 は `.vscode/` に 保管 します。共有 設定 は `config.toml` に 集約 し、機密 `auth.json` `internal_storage.json` `version.json` は ローカル 専用 で `.gitignore` を 確認 してください。

## ビルド・テスト・開発コマンド
- `pnpm install` Node 20 と pnpm 9 系 前提 で 依存 を 取得 します。
- `pnpm start` TypeScript ビルド と Vite ウォッチ で 開発 dist を 更新 します。
- `pnpm build` 本番 dist を 生成 し 拡張 に 読み込み ます。
- `pnpm test` / `pnpm test:ui` Vitest を 実行 し 必要 に 応じ `--coverage` を 追加 します。
- `pnpm lint` で ESLint を 実行 し、併せて `codex --help` `codex resume --last` `codex mcp --list` を スモーク 確認 します。

## コーディングスタイルと命名規則
TypeScript と React の コンポーネント は パスカルケース、カスタム フック は `useXxx` 命名 を 推奨 します。ディレクトリ は ケバブケース、JSON キー は スネークケース、TOML と JSON の インデント は 2 スペース を 守ります。Tailwind クラス は 意味 単位 で まとめ、Markdown は おおむね 80 文字 で 改行 してください。

## テスト指針
テスト フレームワーク は Vitest で `@testing-library/react` を 用い UI 振る舞い を 検証 します。コンポーネント ごと に `ComponentName.test.tsx` を 置き、主要 パス と エッジ ケース を カバー します。`pnpm test -- --coverage` で レポート を 生成 し `coverage/` と Codecov バッジ を 監視、閾値 を 下げない よう 留意 します。セッション 処理 を 変更 した 場合 は マスク 済み `sessions/` 抜粋 を 添付 し 手順 を 証明 してください。

## コミットとプルリクエストのルール
コミット メッセージ は 日本語 Conventional Commits を 用い `feat: 任務 タイマー の 自動 更新` の ように 種別 と 要約 を 明示 します。PR は スカッシュ マージ 前提 で テンプレート の 概要、手動 検証、言語 チェック、リスク、関連 リンク を 必ず 埋めます。`config.toml` を 変更 した 場合 は 対象 プロファイル、更新 キー、期待 結果 を 表形式 で 記述 し、必要 に 応じ スクリーンショット や ログ を 添付 してください。レビュアー が 手順 を 追える よう 実施 コマンド を 箇条書き で 残します。

## セキュリティ と 設定 の 注意点
`pnpm build` 後 は `pnpm remove-remote-code` を 実行 し 外部 CDN 参照 を 除去 します。権限 拡張 前 に `config.toml` の `trust_level` を 見直し 最小 権限 を 保ちます。共有 不可 ファイル は リポジトリ 外 に 留め、追加 環境 変数 は `.env.local` 等 無視 対象 に 記述 します。`.gitignore` の 保護 状態 を 定期 確認 し 問題 が あれば 速やか に Issue を 起票 してください。
