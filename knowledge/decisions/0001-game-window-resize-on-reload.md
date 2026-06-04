# ゲーム別窓のサイズ調整とリロード耐性に関する設計判断記録

- ステータス: 採用
- 日付: 2026-06-04
- 関連 Issue: [#1784](https://github.com/KanCraft/kanColleWidget/issues/1784)（再読み込み後に窓がぴったり合わずスクロールバーが出る）
- 関連コード: `src/services/Launcher.ts`, `src/injection/dmm.ts`, `src/background.ts`, `src/public/manifest.json`

## 概要

艦これウィジェットは、ゲーム（`play.games.dmm.com/game/kancolle`）を独立したポップアップ窓で開き、その窓のコンテンツ領域がゲーム画面にぴったり合うようサイズ調整する。本ドキュメントは「拡張から開いた窓にだけ、確実にサイズ調整を適用する」という要件をめぐる設計判断と、Issue #1784（リロード後に窓が合わない）の根本原因・対応方針を記録する。

結論を先に述べると、**現在の API 方針（`chrome.windows.create({type:"popup"})` ＋ 注入スクリプト内での `resize()`）は妥当**である。問題は方針ではなく、「`chrome.scripting.executeScript` で注入したスクリプトがページのリロードで失われる」という Manifest V3 の仕様に起因する。よって**リロードを検知して注入一式を再実行する**ことで対応する。

## 背景と要件

「Chrome 拡張から、任意サイズで・移動可能な・独立したウィンドウとして、クロスオリジンのゲーム画面を開く」という UX を提供したい。さらに、サイズ調整やボタン描画・OCR などの注入処理は、**ユーザーが普通のタブで開いたゲームには波及させず、拡張自身が開いた窓だけ**に限定したい（所有権スコープ）。

## 検討した選択肢（窓を開く API）

| 選択肢 | 評価 | 理由 |
|--------|------|------|
| `chrome.windows.create({type:"popup"})`（採用） | ◎ | クロスオリジン URL を独立窓・任意サイズ・移動可で開ける唯一の安定 API |
| Chrome Apps `chrome.app.window`（`innerBounds`） | × | コンテンツ領域を直接指定できる理想的 API だが、Chrome Apps は 2020 年に廃止済み・拡張では使用不可 |
| Document Picture-in-Picture API | × | iframe から開けない／任意クロスオリジン URL へナビゲートできない／ユーザージェスチャ必須／opener タブに紐づき独立永続しない |
| `window.open(url, name, "width=…")` | × | MV3 の Service Worker には DOM がなく呼べない。ポップアップブロッカや位置制御不可の問題も |
| Side Panel / offscreen | × | 「任意サイズ・移動可能な独立窓」という UX 自体を満たさない |

### `chrome.windows` の本質的制約

`chrome.windows.create` の `width`/`height` は公式ドキュメント上 **"including the frame"（フレーム込み＝外形）** であり、コンテンツ領域（inner）を直接指定する手段がない。よって「ゲーム画面をぴったり」にするには `外形 − 内寸` の差分（bezel／タイトルバー）を補正する必要があり、これは API 仕様上避けられない。加えて歴史的にプラットフォーム差・解釈ゆれもあった（Chromium #173831）。

そのため現実装は、窓の内側から `window.outerWidth - window.innerWidth` を実測して `window.resizeBy(...)` で確定させている（`dmm.ts` の `resize()`）。これは外形指定の不確実性をクライアント実測で潰す合理的な回避策である。

## 所有権スコープの設計（「自分が開いた窓だけ」）

### 課題

MV3 では Service Worker が揮発するため、`windows.create()` が返した `windowId` をメモリに保持できない。`windowId` は永続的でもない（ブラウザ再起動でリセット、再利用もありうる）。よって「後から・新鮮な SW でも再同定できる、観測可能な性質」に頼る必要がある。

### 現状の同定ロジック

`Launcher.find()` が以下の 3 条件のヒューリスティックで同定する。

1. `windowType: "popup"`
2. URL が `https://play.games.dmm.com/game/kancolle` で `startsWith`
3. `win.tabs.length === 1`（単一タブ）

（`Launcher.anchor()` が sessionStorage に書く `kancollewidget-frame-jsonstr` は、現状 background の同定には使われていない。）

### 重要な洞察

`resize()` は注入した `dmm.js` の中で動くため、**スクリプトが「そこに在ること」自体が所有権の証明**になっている。すなわちサイズ調整は構造的に「拡張が注入した窓だけ」に限定されており、この設計はエレガントである。外から `chrome.windows` を叩いて毎回「どの窓か」を判定する必要がない。

## 本質的なトレードオフ（注入方式）

「自分の窓だけに適用」と「リロード耐性」は、注入方式の選択でトレードオフになる。

| 注入方式 | リロードで自動再実行 | 所有権スコープ |
|----------|:---:|:---:|
| 宣言的 content_scripts（manifest `matches` ＋ `document_idle`）／`registerContentScripts` | ✅ 自動で再走る | ❌ URL パターン一致なので、ユーザーが普通のタブで開いたゲームにも走る |
| プログラム注入（現状 `scripting.executeScript`） | ❌ リロードで走らない | ✅ 注入した窓にしか存在しない |

「manifest に content_scripts を足す／`registerContentScripts` に切り替える」は一見リロード問題を解決するが、**所有権スコープを失う**ため不採用。

## Issue #1784 の根本原因

公式ドキュメント（chrome.scripting）の通り、**`scripting.executeScript()` で注入したスクリプトはリロード／ナビゲーションで永続しない（run once）**。

その結果、ゲーム窓をリロードすると `dmm.js` 一式が新しいドキュメントから失われ、以下がすべて停止する。

- `resize()` → 窓が合わずスクロールバーが出る（**#1784 で報告された症状**）
- ミュート／スクリーンショットボタン（`InAppActionButtons`）
- OCR の `onMessage` リスナー → 入渠・建造タイマーの OCR が無反応
- `beforeunload` の確認ダイアログ

つまり **#1784 は氷山の一角**であり、本質は「リロードで dmm.js 一式が失われる」こと。

なお、既存の `/injected/dmm/retouch` メッセージ経路（`Launcher.retouch()` → `dmm.ts`）は、**同一ドキュメントが生きているケース（拡張から開き直しただけ）でのみ機能する**。リロード後はリスナー自体が消えているため、メッセージを送っても無反応であり、#1784 の対策にはならない。

## 決定

リロードを検知し、`activate()` 相当の**注入一式を再実行**する。サイズ調整だけでなく、ボタン・OCR・mute も同時に復活する。

採用する実装方針（最小・外科的）:

- `chrome.webNavigation.onCommitted` のリスナーを新設する。
- ガート条件:
  - `details.frameId === 0`（トップフレームのみ）
  - `details.transitionType === "reload"`（リロードのみ。初回ロードと区別でき、**二重注入を構造的に回避**できる）
  - `details.url` が `KanColleURL` で始まる
  - その窓が自分のポップアップであること（`Launcher.find()` で所有権確認）
- 処理:
  - `waitForInnerIframeLoaded()` で内側 iframe（`osapi.dmm.com`）の再ロードを待機
  - `activate()` 相当を再実行（`dmm.js` ＋ `dmm.css` ＋ `osapi.css` を再注入）
  - `dmm.js` の `__main__` が `resize()` を呼び、窓がぴったり戻る
- 権限は既存の `scripting` / `tabs` / `webNavigation` で充足（追加不要）。

## この方針を選んだ理由

- `launch()` の初回起動フローを変更しないため**リスクが小さい**。
- `transitionType === "reload"` ガートにより**二重注入が原理的に起きない**（同一ドキュメントへの `setInterval` やリスナー重複を回避）。
- `Launcher.find()` による所有権確認で**スコープを維持**し、普通のタブに波及しない。
- resize だけでなく、リロードで失われていた**ボタン／OCR／mute も復活**する。
- 新規配管は「onCommitted コントローラ 1 つ」＋ `Launcher` の再活性化ヘルパー程度に収まる。

## 影響と今後の課題

- 現状の所有権ヒューリスティックには弱点が残る。ポップアップ内で 2 つ目のタブが開くと `tabs.length === 1` 条件で窓を見失い、URL の `startsWith` は DMM 側のパス変更に弱い。
- 将来の堅牢化として、作成時の `windowId` を `chrome.storage.session`（SW の再起動を跨いで保持される揮発ストレージ）に保存し、`windows.onRemoved` で掃除する案がある。これにより外形ヒューリスティックへの依存を減らせる。ただし #1784 の解決には必須ではないため、本対応のスコープ外とする。

## 参考資料

- [chrome.windows | Chrome for Developers](https://developer.chrome.com/docs/extensions/reference/api/windows)（`width`/`height` = "including the frame"）
- [chrome.scripting | Chrome for Developers](https://developer.chrome.com/docs/extensions/reference/api/scripting)（`executeScript` は run once・永続しない／`registerContentScripts` は永続）
- [chrome.app.window | Chrome for Developers](https://developer.chrome.com/docs/apps/reference/app/window)（`innerBounds`/`outerBounds`。Chrome Apps は廃止済み）
- [DocumentPictureInPicture.requestWindow() | MDN](https://developer.mozilla.org/en-US/docs/Web/API/DocumentPictureInPicture/requestWindow)（iframe 不可・起動制約）
- [chrome.webNavigation | Chrome for Developers](https://developer.chrome.com/docs/extensions/reference/api/webNavigation)（`onCommitted` の `transitionType`）
- Chromium #173831（`windows.create` の width/height 解釈の歴史的不整合）
