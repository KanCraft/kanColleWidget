# 憲章 — 3 原則

設計判断はこの 3 つから導く。コードと食い違ったらコードが正しいが、原則に反するコードは直す対象になる。

## 1. 所有権のスコープ（ownership-scope） — 拡張が手を入れるのは、拡張自身が開いたゲーム窓だけ

利用者は普通のタブや他の艦これ補助拡張と併用する。取りこぼしを減らすために所有権の判定を緩めると、他拡張の窓やユーザーのタブを壊す。取りこぼしより競合の回避を優先する。

- 注入は `scripting.executeScript` のプログラム注入だけ。manifest の `content_scripts` や `registerContentScripts` は使わない。
- 窓の同定は、記録した windowId を優先し、URL と単一タブのヒューリスティックはフォールバックに留める。
- 取りこぼしは注入のきっかけを増やすことと冪等化（原則 2）で埋め、所有権の確認は外さない。

正本: `src/services/Launcher.ts`（`find` / `activate`）、`src/services/GameWindowRegistry.ts`、`src/controllers/WebNavigation.ts`、`tests/game-window-registry.spec.ts`

## 2. 処理側の冪等化（idempotent-handlers） — 1 回だけ実行すべき処理は、何度呼ばれても安全にする

MV3 の Service Worker は止まり、ページはリロードされ、ブラウザ主導の再読み込みのイベントは環境ごとに違う。いつ発火するかを列挙して絞るやり方は網羅できない。

- ガードは処理の寿命に合わせて選ぶ。リロードをまたぐなら `sessionStorage`、document の間だけなら `window` のフラグ、キューに紐づくなら Queue のフィールド（`sortied` / `reminded`）。
- check-and-set は 1 回の呼び出しの中で行い、並走しても 1 回に収束させる。
- 失敗したらガードを戻し、次の機会に再試行できるようにする。
- 非冪等な補正（`resize()` など）は呼び出し箇所を限り、コメントで明示する。

正本: `src/services/Launcher.ts`（`activate`）、`src/injection/dmm.ts`（`kcw_resized`）、`src/controllers/Cron/QueueWatcher.ts`、`tests/launcher-activate-idempotent.spec.ts`、`tests/mission-remind.spec.ts`

## 3. プレイの邪魔をしない（non-intrusive） — 拡張は提督の注意を奪わず、求められた分だけ助ける

利用者はゲームに集中したい。通知や画面の追加は便利さと同時に負担になり、権限の追加は導入の不安になる。

- 新しい通知や機能は既定で OFF にし、使いたい人だけが有効にする。
- 通知は自分で消える（`stay` が false なら 10 秒で消す）。残すのはユーザーが選んだときだけ。
- ゲーム画面に重ねる UI は、表示直後に気づかせ、そのあとは操作の邪魔をしない。
- 権限は機能に必要な分だけ足し、理由をコミットに残す。`host_permissions` の `<all_urls>` はショートカットからのスクリーンショット（`captureVisibleTab`）のため。dev 専用の権限は dev ビルドにだけ入れる。

正本: `src/models/configs/NotificationConfig.ts`、`src/services/NotificationService.ts`、`src/injection/osapi.ts`、`src/public/manifest.template.json`、`scripts/build-manifest.ts`
