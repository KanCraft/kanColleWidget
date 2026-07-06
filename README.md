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

## コンテナ開発フロー

### Dev Container (VS Code / Codespaces)

1. VS Code に Dev Containers 拡張を入れ、このリポジトリを開く。
2. コマンドパレットで `Dev Containers: Reopen in Container` を実行する。
3. `.devcontainer/devcontainer.json` がルートの `Dockerfile` をビルドし、
   `kcw-node-modules` ボリュームを自動設定する。
4. コンテナ内のターミナルで `pnpm start` を実行すると `vite build --watch`
   が走り、`src/` の変更が `dist/` に即時反映される。
5. `chrome://extensions` 側で「パッケージ化されていない拡張機能を読み込む」
   から `dist/` を指定し、更新時は再読み込みするだけでよい。
6. 依存追加を行った場合はコンテナ内で `pnpm install --frozen-lockfile` を
   実行し、`kcw-node-modules` にキャッシュされることを確認する。

### Docker 単体での利用

Dev Container を使わない場合も、ルートの `Dockerfile` で同じ環境を
構築できる。

```sh
docker build -t kcw-dev .
docker run --rm -it \
  -v "$(pwd)":/workspace \
  -v kcw-node-modules:/workspace/node_modules \
  kcw-dev
# コンテナ内で自動的に pnpm install が実行され、続けて pnpm start が起動
```

- Makefile からまとめて起動したい場合は `make dev` を利用すると上記と
  同じコマンド列が実行される。
- `pnpm start` は `tsc && pnpm run copy-tesseract && vite build --watch` を
  実行し、`dist/` を監視更新する。Chrome 拡張には監視済み `dist/` を
  読み込ませるだけでよい。
- ファイル監視を安定させるため `CHOKIDAR_USEPOLLING=1` 等を既定で有効化
  済み。変更が伝播しない場合は `pnpm start -- --poll 100` を試す。
- `kcw-node-modules` ボリュームを削除したい場合は
  `docker volume rm kcw-node-modules` を実行する。

# リリースフロー

## 概要

開発は **`main` 1本** で行います（`develop` ブランチは廃止）。リリースは GitHub に完結し、
**バージョンの位置** で配信先が決まる、という1つのルールに集約されています。

- **ベータ版** … `main` の `package.json` の version が **直近のタグより先行している間**、
  毎朝 06:30 JST の定期実行で、直近24時間に main へ commit があれば自動で BETA リスティングへ
  公開される（「main は常にベータ版として生きている」）。緊急時は `workflow_dispatch` で
  手動公開もできる。
- **プロダクション版** … **GitHub Release を作成（= タグを打つ）** と、その版が PROD リスティングへ公開される。

バージョンの単一の真実源は **`package.json` の `version`** だけです。
`manifest.json` はビルド成果物として毎回生成されるため、手で編集しません（テンプレートは
`src/public/manifest.template.json`）。

## 1. ベータ版を出す（開発サイクルの開始）

```bash
# バージョンを上げ、リリースノートの未公開エントリを再生成する（唯一の管理コマンド）
make version v=4.9.0

# 生成された release-note.json の message を書く
vim src/release-note.json

# main に push する（毎朝 06:30 JST の定期実行で自動的にベータ公開される）
git add package.json src/release-note.json
git commit -m "v4.9.0"
git push origin main
```

- 毎朝 06:30 JST に、直近24時間で main に commit（`**/*.md` / `docs/**` / `design/**` を除く）
  があれば `manifest.version = 4.9.0.<直近タグからのcommit数>`（例 `4.9.0.5`）でベータ版が
  更新される。表示名は `version_name = 4.9.0-beta.5`。
- Chrome Webstore は同じ version を再アップロードできないため、commit 数を第4成分にして
  単調増加させている。
- `package.json` の version が直近タグと **同じ** 間、または直近24時間に対象 commit が無い間は、
  ベータ公開はスキップされる。
- 今すぐベータ公開したい場合は、GitHub Actions の `Release BETA` ワークフローを
  `workflow_dispatch` で手動実行する。

> BETA リスティング（Chrome拡張ID: `egkgleinehaapbpijnlpbllfeejjpceb`）で動作確認する。

## 2. プロダクション版を出す（昇格）

ベータで問題なければ、GitHub Release を作るだけ。

```bash
gh release create v4.9.0 --generate-notes
```

これで `release-prod.yaml` が発火し、以下が自動実行される：

1. tag が `vX.Y.Z` 形式かつ `package.json` の version と一致するか検証（整合性チェックは1箇所）
2. prod チャンネルでビルド（`manifest.version = 4.9.0`）
3. Chrome Webstore（PROD, Chrome拡張ID: `iachoklpnnjfgmldgelflgifhdaebnol`）へ公開申請
4. ビルドした zip を Release の asset として添付（GitHub に記録）

## リリースフロー図

```
main 1本で開発（develop は廃止）
    │
    ├─ make version v=4.9.0  → package.json と release-note.json を更新
    │      ↓
    │   commit & push to main
    │      ↓
    │   🚀 BETA 自動公開（version 4.9.0.N）   ← 毎朝06:30 JST、直近24hにcommitがあれば繰り返す
    │      ↓
    │   ベータ版で動作確認
    │
    └─ gh release create v4.9.0 --generate-notes
           ↓
        🚀 PROD 公開申請（version 4.9.0）＋ zip を Release に添付
```

## 注意事項

- バージョンを変えたいときは **`make version v=X.Y.Z`** だけを使う（`package.json` が単一の真実源）。
- `manifest.json` は生成物。git 管理されているのは `src/public/manifest.template.json`。
- 本番公開は **GitHub Release の作成** がトリガ。pre-release として作った Release では PROD 公開は走らない。
- ベータ版と本番版は異なる Chrome拡張ID（別リスティング）なので、version の連番は互いに独立。
- Chrome Webstore の審査は非同期（数日かかることがある）。GitHub 上の状態は「公開申請を出した」
  ことを表し、実際にストアへ反映されるのは審査通過後。

# 不具合報告・機能要望

* [https://github.com/kancraft/kanColleWidget/issues](https://github.com/kancraft/kanColleWidget/issues?q=is%3Aissue)
