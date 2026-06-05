---
argument-hint: '[status|beta|prod] [<version>|major|minor|patch]'
description: |
    艦これウィジェットのリリースを駆動する。リリースモデルは「main の version が
    直近タグより先行している間は push のたびに BETA 自動公開 / GitHub Release を作ると
    PROD 公開申請」の1ルール。バージョンの真実源は package.json のみ、manifest.json は
    ビルド生成物。このスキルは (1) 現在のリリース状態の診断、(2) コミット履歴からの
    次バージョン・release-note メッセージの起草、(3) beta サイクル開始（make version →
    commit → push）、(4) prod 出荷（gh release create）を、外向き操作（push＝beta公開、
    Release作成＝prod公開）の承認ゲート付きで行う。`/release [status|beta|prod] [bump]`
    で呼び出す。引数なしは status（診断のみ）。
name: release
---

# Release — 艦これウィジェットのリリース駆動

リリースの真実源は `README.md`「リリースフロー」節と `.github/workflows/release-beta.yaml` /
`release-prod.yaml`。このスキルはそれを変えず、**現在の状態を診断し、次の一手を提案・実行**する。
矛盾を感じたら必ずワークフローの実体を読んで合わせること（このファイルの記述より実体が優先）。

## リリースモデル（前提）

- 開発は **`main` 1本**（develop は廃止済み）。
- **バージョンの単一の真実源 = `package.json` の `version`**。`manifest.json` はビルド時に
  channel 別生成される成果物なので手で触らない。
- **BETA**: `package.json` の version が直近タグより**先行している間**、`main` への push の
  たびに自動公開（`release-beta.yaml`）。`manifest.version = <base>.<直近タグからのcommit数>`、
  `version_name = <base>-beta.<N>`。
- **PROD**: **GitHub Release を作成（= タグ `vX.Y.Z` を打つ）**と公開申請（`release-prod.yaml`、
  `release:published` かつ `prerelease == false`）。tag は `package.json` の version と一致必須。
- 唯一の管理コマンドは **`make version v=X.Y.Z`**（package.json 更新 ＋ release-note 再生成）。

## 安全規則（必読）

外向き・不可逆な操作は **必ず承認ゲートを通す**。承認なしに実行しない:

- `git push origin main` … BETA への公開申請を引き起こす（外向き）。
- `gh release create` … PROD への公開申請を引き起こす（外向き・本番）。

以下に該当したら実行を止め、理由を述べて指示を仰ぐ（BLOCKED）:

- **STATE**: working tree が dirty / `main` 以外にいる / `origin/main` と diverge している。
- **SPEC**: version の決定根拠が無い、release-note の message が空のまま prod に進もうとしている。
- **CONSENT**: push / release create の承認が得られていない。

`make version` や commit までは「準備」だが、**push と release create だけは独立した明示承認**を取る。

## 引数解析

`$ARGUMENTS` の第1トークン:

- なし / `status` → **status**（read-only 診断のみ。何も変更しない）
- `beta` → **beta**（beta サイクルの開始 / 前進）
- `prod` → **prod**（本番 Release の作成）

第2トークン（beta 時）: 明示 version（`4.9.0`）または `major|minor|patch`。省略時は推論。

---

## status（診断）

read-only。以下を並列取得して現在地を判定する:

```bash
git rev-parse --abbrev-ref HEAD          # main か
git status --porcelain                   # clean か
jq -r .version package.json              # BASE
git describe --tags --abbrev=0           # LASTTAG（無ければ none）
git rev-list <LASTTAG>..HEAD --count     # N（commit 数）
git log <LASTTAG>..HEAD --no-merges --oneline   # 未公開コミット
jq -r '.releases[0]' src/release-note.json      # 先頭 release-note エントリ
```

判定とレポート:

- `BASE == LASTTAG(v除去)` → **「タグに追いついている。未公開の変更なし」**。
  次の一手: `/release beta <bump>` で新サイクル開始。
- `BASE != LASTTAG` → **「未公開サイクル中」**。
  - 次に main へ push すると BETA `BASE.N`（version_name `BASE-beta.N`）が公開申請される。
  - 既に push 済みなら BETA は申請済み。PROD に出すには `/release prod`。
  - release-note 先頭エントリの `message` が空なら警告（prod 前に要記入）。

最後に「現状サマリ＋推奨アクション1つ」を提示して終了（変更はしない）。

---

## beta（サイクル開始 / 前進）

### ケース A: 既に未公開サイクル中（`BASE != LASTTAG`）で、追加コミットを beta に出すだけ

version 変更は不要（push すれば `BASE.N` が自動で上がる）。
未 push の commit があるなら「push すると BETA が更新されます」と述べ、**push の承認ゲート**へ。

### ケース B: タグに追いついている（`BASE == LASTTAG`）＝ 新バージョンが必要

1. **次バージョンの決定**
   - 第2引数が明示 version ならそれ。`major|minor|patch` なら現 version から算出。
   - 省略時は `git log <LASTTAG>..HEAD` を読み、変更の性質から **patch/minor/major を推論**して
     提案する（破壊的変更や大きな機能追加 → minor 以上、修正中心 → patch）。推論は提案であり、
     最終決定はユーザーに確認する。
2. **`make version v=X.Y.Z` を実行**（package.json 更新 ＋ `src/release-note.json` 再生成）。
3. **release-note メッセージの起草**: 再生成された `releases[0]` の `message` は空なので、
   `commits` 配列を要約してユーザー向けの1〜2文を起草し、`message` に書き込む（diff を見せる）。
4. ここまでの差分（`package.json` と `src/release-note.json`）を提示して**コミット承認**を取り、
   `git commit`（メッセージは日本語、例 `vX.Y.Z`）。
5. **push 承認ゲート** → 承認後 `git push origin main`。これで BETA が公開申請される旨を伝える。

ビルドが通るかローカル確認したい場合は、push 前に
`KCW_CHANNEL=beta KCW_VERSION=X.Y.Z.N KCW_VERSION_NAME=X.Y.Z-beta.N pnpm build` で
manifest 生成まで検証してよい（任意）。

---

## prod（本番 Release）

1. **前提チェック**（満たさなければ BLOCKED）:
   - `main` にいて working tree clean、`origin/main` と一致（先に `git fetch` で確認）。
   - `BASE != LASTTAG`（= 未公開の版がある）。同じなら「出すものが無い」と報告。
   - `src/release-note.json` の `releases[0].version == vBASE` かつ `message` が非空。
   - **ベータで動作確認済みか**をユーザーに確認（このスキルは確認の事実を代行できない）。
2. リリース版 = `vBASE` を提示。GitHub Release の本文は `--generate-notes` で自動生成される旨を伝える。
3. **release create 承認ゲート**（本番公開申請が走る）。承認後:
   ```bash
   gh release create vBASE --generate-notes --title "vBASE"
   ```
   （pre-release にはしない。pre-release では `release-prod.yaml` が発火しない。）
4. 発火したワークフロー（`release-prod.yaml`）の URL を案内し、必要なら `gh run watch` で追う。
5. **レポート**: 公開申請を出したこと、Chrome Web Store の審査は非同期（数日かかりうる）で、
   実反映は審査通過後であることを明記する。

---

## レポート形式（共通）

```
# Release <status|beta|prod>
Branch: main (clean)            Default sync: origin/main と一致
Version: package.json=<BASE>   Latest tag=<LASTTAG>   State=<追いついている|未公開サイクル中>
Beta 次回公開版: <BASE>.<N>  (version_name <BASE>-beta.<N>)

## 実行したこと
- ...

## 次の一手
- ...

## Notes
- Web Store 審査は非同期。GitHub 上の状態は「公開申請を出した」ことを表す。
```

## 重要なルール

- **README / ワークフローの実体が真実源**。このファイルと矛盾したら実体に合わせる。
- **push と release create は独立した明示承認**を取る（一括承認しない）。
- **version は `make version` 経由でのみ変える**（package.json を直接書き換えない）。
- **manifest.json は触らない**（生成物。テンプレは `src/public/manifest.template.json`）。
- prod は **pre-release にしない**（発火条件 `prerelease == false`）。
- ベータの動作確認の事実は代行しない。必ずユーザーに確認する。
