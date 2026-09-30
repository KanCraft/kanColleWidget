---
date: 2026-07-12
kind: decision
principles: [idempotent-handlers, ownership-scope]
---

# 1 回だけ実行すべき処理は、寿命に合ったガードで冪等にし、発火条件は絞らない

**Date**: 2026-07-12（改訂 2026-09-30: #1848 の自己回復を反映）
**Status**: Accepted。実装済み（PR #1846）
**正本（コード）**: `src/injection/dmm.ts`（`__main__` の `kcw_resized` ガードと `resize`）、`src/services/Launcher.ts`（`activate` / `retouch` / `activateWithRetry`）、`src/controllers/WebNavigation.ts` / `tests/launcher-activate-idempotent.spec.ts`

## 決定

| 処理 | ガード | 寿命 |
|---|---|---|
| `resize()`（`dmm.ts` の `__main__`） | `sessionStorage.kcw_resized` | 同じタブが生きている間。リロードをまたいで残る |
| 注入一式（`Launcher.activate`） | `window.__kancolleWidgetActivated` を 1 回の `executeScript` で check-and-set | 同じ document の間。ナビゲーションで消える |

- 冪等にしたので `transitionType === "reload"` の限定をやめ、`WebNavigation` はゲーム URL へのトップフレームのコミット全般を拾う。所有権の確認（`Launcher.find()` と tabId 一致）は維持する。
- 注入が失敗したらフラグを戻し、次の機会に再試行できるようにする。`open()` からは 500ms 間隔で最大 2 回まで再試行する（#1848）。
- `/injected/dmm/retouch` 経由の `resize()` は無条件のまま。`Launcher.retouch()` が直前に `windows.update({...frame.size})` で外形を戻すので、毎回の補正が正しい。

## なぜ

- `resize()` は外形に装飾ぶんを足す非冪等な補正で、外形が整った直後の 1 回だけが正しい。リロード再注入のたびに呼ぶと縦に 30〜40px ずつ伸び、上下に黒帯が出た（#1813）。`track()` が 10 秒ごとに内寸を `__memory__` に保存するので、次回の起動サイズまで汚れる。
- ブラウザ主導の再読み込み（休止からの復帰など）では transitionType が `"reload"` にならないことがあり、再注入が発火しなかった（#1845）。transitionType は環境依存で列挙しきれない。だから発火側を絞らず、処理側を何度呼ばれても安全にする。
- check-and-set を 1 回の `executeScript` にまとめるので、初回起動で `open()` と `onCommitted` が並走しても注入は 1 回に収束する。
- 却下: `resizeTo` の絶対指定や、`reactivate` の前に `windows.update` で外形を戻す案は、ユーザーの手動リサイズをリロードのたびに巻き戻す。
- 受容した弱点: 既に膨らんで `__memory__` に保存されたサイズは自動では縮まない。
