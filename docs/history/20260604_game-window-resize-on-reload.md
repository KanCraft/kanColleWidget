---
date: 2026-06-04
kind: decision
principles: [ownership-scope]
---

# ゲーム窓は popup で開き、注入はプログラム注入に限り、リロードでは注入一式をやり直す

**Date**: 2026-06-04（改訂 2026-09-30: #1848 の windowId 記録と 20260712 の冪等化を反映）
**Status**: Accepted。実装済み
**正本（コード）**: `src/services/Launcher.ts`（`open` / `activate` / `reactivate` / `find`）、`src/services/GameWindowRegistry.ts`（windowId の記録）、`src/controllers/WebNavigation.ts`（リロード検知）、`src/injection/dmm.ts`（`resize`）/ `tests/launcher-activate-idempotent.spec.ts`、`tests/game-window-registry.spec.ts`

## 決定

- ゲーム窓は `chrome.windows.create({type:"popup"})` で開く。内寸は注入した `dmm.js` が `outerWidth - innerWidth` を実測して `resizeBy` で合わせる。
- 注入は `scripting.executeScript` のプログラム注入だけを使う。manifest の `content_scripts` や `registerContentScripts` は使わない。
- プログラム注入はリロードで失われるので、`webNavigation.onCommitted` でゲーム URL へのトップフレームのコミットを拾い、`Launcher.reactivate` で注入一式（`dmm.js` / `dmm.css` / `osapi.css`）をやり直す。発火条件と二重注入の防ぎ方は [20260712](20260712_idempotent-injection-and-resize.md)。
- 窓の同定は、`GameWindowRegistry` が `chrome.storage.session` に記録した windowId を優先し、記録が無いか実体が消えていれば URL 前方一致かつ単一タブの popup へフォールバックする（#1848）。

## なぜ

- `chrome.windows.create` の `width` / `height` はフレーム込みの外形で、内寸を直接指定できない。内側からの実測補正しか手が無い。
- 宣言的注入はリロードに強いが、URL パターン一致なのでユーザーが普通のタブで開いたゲームにも走る。所有権のスコープを失うので採らない。注入したスクリプトが「そこに在ること」自体が、拡張が開いた窓である証明になっている。
- リロードで失われるのは resize だけではない。ボタン、OCR の受信、mute、`beforeunload` も同時に止まる（#1784 は氷山の一角だった）。だから resize だけ直すのではなく注入一式をやり直す。
- `/injected/dmm/retouch` は同じ document が生きているときしか届かないので、リロード対策にはならない。
- 却下した窓 API: `chrome.app.window` は Chrome Apps ごと廃止、Document PiP は iframe から開けずクロスオリジンに遷移できない、`window.open` は Service Worker から呼べない、Side Panel と offscreen は独立窓にならない。
- 受容した弱点: registry の記録はブラウザ終了で消える。その後のフォールバックは、同じ URL の popup を開く他拡張の窓と区別できない。popup 内で 2 つ目のタブが開くと見失う。
