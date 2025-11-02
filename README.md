# 艦これウィジェット

[![JavaScript CI](https://github.com/KanCraft/kanColleWidget/actions/workflows/javascript-ci.yaml/badge.svg)](https://github.com/KanCraft/kanColleWidget/actions/workflows/javascript-ci.yaml)
[![codecov](https://codecov.io/gh/KanCraft/kanColleWidget/graph/badge.svg?token=GqJlbto2hH)](https://codecov.io/gh/KanCraft/kanColleWidget)

[![Coverage Graph](https://codecov.io/gh/KanCraft/kanColleWidget/graphs/tree.svg?token=GqJlbto2hH)](https://codecov.io/gh/KanCraft/kanColleWidget/graphs/tree.svg?token=GqJlbto2hH)

## インストール

**ベータ版**<br>
<a href="https://chromewebstore.google.com/detail/%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88-beta/egkgleinehaapbpijnlpbllfeejjpceb">
  <img src="https://developer.chrome.com/static/docs/webstore/branding/image/iNEddTyWiMfLSwFD6qGq.png" alt="Chrome Web Store (BETA)で入手" height="58">
</a>

**公開版**</br>
<a href="https://chromewebstore.google.com/detail/%E8%89%A6%E3%81%93%E3%82%8C%E3%82%A6%E3%82%A3%E3%82%B8%E3%82%A7%E3%83%83%E3%83%88/iachoklpnnjfgmldgelflgifhdaebnol">
  <img src="https://developer.chrome.com/static/docs/webstore/branding/image/iNEddTyWiMfLSwFD6qGq.png" alt="Chrome Web Storeで入手" height="58">
</a>


# 開発

```sh
git clone git@github.com:KanCraft/kanColleWidget.git
cd kanColleWidget
git checkout develop
pnpm install
pnpm test run
pnpm build
# ここでできあがったdistフォルダを、
# chrome://extensions にて読み込む
```

# リリースフロー

## 概要

このプロジェクトは `develop` ブランチで開発し、`main` ブランチへのマージでリリースされます。
リリースには**ベータ版**と**プロダクション版**の2段階があります。

## 1. 開発からベータリリースまで

### 1.1 バージョンアップの準備

```bash
# 1. package.json のバージョンを更新（例: 4.0.12 → 4.0.13）
vim package.json

# 2. リリースノートを自動生成
make draft
# これにより以下が自動更新されます：
#   - manifest.json のバージョン
#   - release-note.json に新しいリリースエントリ追加

# 3. release-note.json を編集してリリースメッセージを記入
vim src/release-note.json
```

### 1.2 コミット＆プッシュ

```bash
git add package.json src/public/manifest.json src/release-note.json
git commit -m "v4.0.13"
git push origin develop
```

### 1.3 プルリクエスト作成

1. `develop` → `main` へPRを作成
2. **PRタイトルを `[v4.0.13]` の形式に編集**

👉 **この時点で自動的にベータ版がChrome Webstoreに公開されます**

## 2. プロダクションリリース

### 2.1 ベータ版の動作確認

ベータ版（Chrome拡張ID: `egkgleinehaapbpijnlpbllfeejjpceb`）で動作確認を行います。

### 2.2 プルリクエストをマージ

PRをマージすると、以下が自動実行されます：

1. バージョン整合性チェック（PRタイトル、package.json、manifest.json、release-note.jsonが一致しているか）
2. `develop` ブランチに `v4.0.13` タグを作成・push
3. プロダクション版ビルド実行
4. Chrome Webstoreに本番公開（Chrome拡張ID: `iachoklpnnjfgmldgelflgifhdaebnol`）

## リリースフロー図

```
develop ブランチで開発
    ↓
package.json のバージョン更新
    ↓
make draft（manifest.json、release-note.json 自動更新）
    ↓
コミット & プッシュ
    ↓
develop → main へPR作成
    ↓
PRタイトルを [vX.X.X] に編集
    ↓
🚀 ベータ版リリース（自動）
    ↓
ベータ版で動作確認
    ↓
PRをマージ
    ↓
🚀 プロダクション版リリース（自動）
    ↓
develop ブランチに vX.X.X タグが作成される
```

## 注意事項

- PRタイトルは必ず `[v` で始める（例: `[v4.0.13]`、`[v4.0.13] 新機能追加`）
- バージョン番号は package.json、manifest.json、release-note.json で一致している必要があります
- ベータ版と本番版は異なるChrome拡張IDを使用しています

# 不具合報告・機能要望

* [https://github.com/kancraft/kanColleWidget/issues](https://github.com/kancraft/kanColleWidget/issues?q=is%3Aissue)