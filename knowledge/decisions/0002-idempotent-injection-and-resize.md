# 注入とサイズ補正の冪等化に関する設計判断記録

- ステータス: 採用
- 日付: 2026-07-12
- 関連 Issue: [#1813](https://github.com/KanCraft/kanColleWidget/issues/1813)（F5 リロードで上下に黒帯が入り累積する）、[#1845](https://github.com/KanCraft/kanColleWidget/issues/1845)（休止復帰後のブラウザ主導リロードで位置ずれ・スクロールバー）
- 関連する過去の判断: [0001](./0001-game-window-resize-on-reload.md)（#1784 のリロード再注入）、#1810/#1812（通知クリックの黒帯累積）
- 関連コード: `src/injection/dmm.ts`, `src/services/Launcher.ts`, `src/controllers/WebNavigation.ts`

## 問題

ADR 0001 で導入した「リロード検知 → dmm.js 一式を再注入」（#1784 対応）には、2 つの穴があった。

### 1. `resize()` が非冪等（#1813）

`dmm.ts` の `resize()` は `window.resizeBy(outerWidth - innerWidth, outerHeight - innerHeight)` で、
「外形指定で作られた窓に、ウィンドウ装飾（タイトルバー等）ぶんを足して内寸を合わせる」補正である。
これは**外形がフレーム設定どおりに整えられた直後の 1 回に限り正しい**。

ところがリロード再注入の経路（`WebNavigation → Launcher.reactivate → activate → dmm.js`）は、
`retouch()` と違って事前に `windows.update({...frame.size})` で外形を基準へ戻さないため、
再注入された `__main__` が呼ぶ `resize()` がリロードのたびに装飾ぶん（縦 30〜40px）を**加算**する。
内寸が 1200:720 より縦長になり、内側 iframe の中央寄せ背景（`#222`）が上下黒帯として現れ、
リロード回数に比例して窓が伸びる。#1810（通知クリック経路、#1812 で修正済み）と同根の
「resize() の誤適用」が、別経路で残っていた。

さらに `track()` が膨らんだ内寸を 10 秒ごとに `__memory__` へ保存するため、
汚染が次回起動サイズにも波及していた。

### 2. `transitionType === "reload"` 限定の取りこぼし（#1845）

ADR 0001 は初回ロードとの二重注入を避けるため `transitionType === "reload"` のみを
再注入対象にした。しかし PC 休止からの復帰時など、ブラウザ主導の再読み込み
（タブ破棄からの復元等）では transitionType が `"reload"` にならないことがあり、
再注入が発火しない。dmm.js/CSS が失われたままになり、#1784 と同型の
「ゲームが上にずれて右下にスクロールバー」が再発していた。

また `waitForInnerIframeLoaded()` に (a) resolve/reject 後も `return` せず
ポーリングが回り続けるバグ、(b) 復帰直後の遅いネットワークには 8 秒タイムアウトが
短すぎる問題があり、reject 時は注入自体が行われずに終わっていた。

## 決定

**「1 回だけ実行すべき処理」に、それぞれ適切な生存期間のガードを持たせて冪等化する。**
イベント側（いつ発火するか）を絞るのではなく、処理側（何度呼ばれても安全）を保証する方針へ転換する。

| 処理 | ガード | 生存期間 | 効果 |
|------|--------|----------|------|
| `resize()`（`dmm.ts __main__`） | `sessionStorage.kcw_resized` | 同一タブの生存中（**リロードを跨いで残る**） | 窓の生成後 1 回だけ補正。リロード再注入では実行されず、累積が止まる（#1813）。ユーザーの手動リサイズも保持される |
| dmm.js/CSS 注入（`Launcher.activate()`） | `window.__kancolleWidgetActivated` を `scripting.func` で check-and-set | 同一 document の生存中（**ナビゲーションで消える**） | 同じ document への二重注入（リスナー・ボタン・track タイマーの多重化）を防ぎつつ、リロード後の新しい document には確実に再注入される |

check-and-set（読み取りと書き込み）を 1 回の `executeScript` 内で行うため、
初回起動時に `open()` と `onCommitted` ハンドラが並走しても注入は 1 回に決まる。

この冪等化により `transitionType === "reload"` ガードは不要になったので、
`WebNavigation` は**トップフレームのゲーム URL へのコミット全般**を対象に広げ、
ブラウザ主導の再読み込みも拾う（#1845）。所有権確認（`Launcher.find()` +
tabId 一致）は従来どおり維持し、普通のタブには波及させない。

あわせて `waitForInnerIframeLoaded()` は resolve/reject 後に `return` して
ポーリングを止め、タイムアウトを 30 秒へ延長した。

なお `/injected/dmm/retouch` メッセージ経由の `resize()` は無条件のまま維持する。
retouch は `Launcher.retouch()` が `windows.update({...frame.size})` で外形を基準へ
戻した直後に届くため、そこでの補正は毎回必要である。

## 検討した代替案

| 案 | 評価 | 理由 |
|----|------|------|
| `resize()` を `resizeTo`（絶対指定）に変える | △ | 冪等にはなるが、目標サイズを content script に伝える配管が必要になり、ユーザーの手動リサイズをリロードで巻き戻してしまう |
| `reactivate()` で事前に `windows.update({...frame.size})` する（retouch と同型） | △ | 累積は止まるが、同じく手動リサイズをリロードのたびに巻き戻す。また #1845（そもそも発火しない）には効かない |
| transitionType の対象を列挙で増やす（`"auto_toplevel"` 等） | × | ブラウザ主導リロードの transitionType は環境依存で網羅できず、いたちごっこになる |

## 影響と今後の課題

- 既存ユーザーの `__memory__` に保存された「膨らんだサイズ」は自動では縮まないが、
  累積が止まるため一度手動で直せば以後は安定する。
- 所有権ヒューリスティック（ADR 0001 の課題）は未着手のまま。`chrome.storage.session` に
  windowId を保存する堅牢化案は引き続き将来課題とする。
