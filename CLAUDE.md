# 艦これウィジェット - プロジェクト概要

## プロジェクトについて
このプロジェクトは「艦これウィジェット」というChrome拡張機能です。艦隊これくしょん（艦これ）のプレイヤー向けのユーティリティツールを提供します。

## 主な機能
- 遠征・入渠・建造の通知
- 疲労度管理
- スクリーンショット機能
- ゲーム画面のリサイズ・切り抜き

## 開発環境
- TypeScript
- React
- Vite
- Tailwind CSS
- Chrome Extension Manifest V3

## ビルド方法
```bash
pnpm install
pnpm build
```

## テスト実行
```bash
pnpm test
```

## 開発モード
```bash
pnpm dev
```

## ディレクトリ構造
- `/src/background.ts` - バックグラウンドスクリプト
- `/src/controllers/` - 各種コントローラー（アラーム、通知、WebRequest等）
- `/src/models/` - データモデル（遠征、入渠、建造等）
- `/src/page/` - UI画面（ダッシュボード、オプション、ポップアップ）
- `/src/injection/` - コンテンツスクリプト
- `/src/services/` - 各種サービス（スクリーンショット、権限管理等）

## 注意事項
- Chrome拡張機能の権限設定に注意してください
- 艦これのAPI通信を監視するため、webRequest権限を使用しています