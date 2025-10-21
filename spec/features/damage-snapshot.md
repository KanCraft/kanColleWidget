# Feature Specification: 大破進撃防止窓

**対象バージョン**: v4.0.2 以降  
**関連リリースノート**: `src/release-note.json` の `v4.0.2` における「大破進撃防止窓の最小限実装」

## 概要
- 艦これ戦闘終了後に艦隊の損傷状況を自動で切り抜き、ゲーム画面上部にオーバーレイとして提示する防止機能。
- クリックによる進撃操作の前に最新の損傷情報を視認させ、大破艦の誤出撃を抑止する。
- 単艦隊戦と連合艦隊戦に対応し、必要回数分クリックするまではオーバーレイが更新または残留する。

## 目的と利用者価値
- 大破艦を誤って進撃させるヒューマンエラーを予防する安全ガードレール (`spec/kan-colle-widget-product-vision.md` の安全要件)。
- 戦闘後の操作フローに介入せず、ユーザーのクリック動作と連携して必要なタイミングのみ表示する。

## 関連モジュール
- `src/controllers/WebRequest/index.ts`: `chrome.webRequest.onCompleted` で `/kcsapi/api_req_sortie/battleresult` 等を検知し、`/injected/kcs/dsnapshot:prepare` をゲーム iframe へ送信。
- `src/controllers/WebRequest/kcsapi.ts`: 母港帰投や戦闘開始などで `/injected/kcs/dsnapshot:remove` を送信し、不要なオーバーレイを掃除。
- `src/injection/osapi.ts`: ゲーム iframe に注入される `DamageSnapshot` クラスがオーバーレイ描画とクリックハンドリングを担う。
- `src/controllers/Message.ts`: `/damage-snapshot/capture` リクエストを受け取り、タブキャプチャ・トリミング後に `/injected/kcs/dsnapshot:show` を返送。
- `src/services/CropService.ts`: `damagesnapshot()` で損傷一覧エリアを切り抜き `data:` URI を生成。
- `src/utils.ts`: `WorkerImage` と `sleep` がキャプチャ処理の基盤。

## 動作シーケンス
1. `chrome.webRequest.onCompleted` が戦闘結果 API (`/kcsapi/api_req_sortie/battleresult` または `/kcsapi/api_req_combined_battle/battleresult`) を検出すると、`count` (連合艦隊時は 2、それ以外は 1) と `timestamp` を含む `/injected/kcs/dsnapshot:prepare` を発火。
2. iframe 内の `DamageSnapshot.prepare` が `canvas` 要素へ `mousedown` リスナーを登録し、`timestamp` から `ignoreMillisecFromBattleResulted` (7.8 秒) 経過後のクリックのみ処理。
3. ユーザーが戦闘リザルト画面でクリックすると、`DamageSnapshot.onClickNext` が `/damage-snapshot/capture` を背景ページへ送信し、`after` パラメータで待機時間を指示 (初回 1000 ms、以降クリック毎に 800 ms 追加)。
4. `src/controllers/Message.ts` が待機後に `chrome.tabs.captureVisibleTab` でスクリーンショットを取得し、`CropService("damagesnapshot")` でゲーム比率に応じた領域 (幅 5/24、高さ 103/180、左上 6/25, 7/18) を切り抜き `data:` URI を生成。
5. 生成した URI と `timestamp` を `/injected/kcs/dsnapshot:show` で返送し、`DamageSnapshot.show` が `#kcw-damagesnapshot` コンテナに `img` を差し替え。
6. クリック回数が `count` に達すると `DamageSnapshot.reset` が発火し、追加キャプチャ要求を停止。母港 API や戦闘開始 API 受信時は `DamageSnapshot.remove` が呼ばれコンテナを削除。

## UI 挙動
- コンテナは `position: fixed`、画面左上・高さ 40%・幅は画像依存。通常時の `opacity` は 0、ホバーで 1 までフェード。
- クリック時は `window.confirm` を表示し、ユーザーが明示的に承認した場合のみ `remove()` が実行される (remove メッセージが届かないケースへの暫定対策)。
- 画像は `height: 100%` に拡縮され、縦横比はトリミング時点で保持される。

## 状態管理とパラメータ
- `count`: 必要キャプチャ回数。単艦隊=1、連合艦隊=2。`prepare` で受信し、クリック毎に `clicked` をインクリメント。
- `timestamp`: 戦闘結果検出時刻を保持し、後続メッセージの整合性確認に利用 (`show` / `capture` で伝搬)。
- `ignoreMillisecFromBattleResulted`: 7800 ms。戦闘結果画面の「次へ」ボタン描画完了前の誤クリックを無視。
- `after`: キャプチャ待機時間。初回 1 秒、以後 `800 ms * clicked` を加算し、演出描画が終わるまで猶予を持たせる。
- `listener`: `canvas` へ付与する `mousedown` リスナー。`removeEventListener` により確実に掃除。

## 解除条件
- 背景側の `/injected/kcs/dsnapshot:remove` (母港読み込み、戦闘開始など) を受信した場合。
- ユーザーがオーバーレイをクリックし、確認ダイアログで破棄を選択した場合。
- `count` クリック達成後に `reset()` が呼ばれた場合（オーバーレイは残るがイベントは停止。次の API で再度 `remove` が送られる想定）。

## エラー耐性・既知課題
- `src/injection/osapi.ts#L90` 付近の `FIXME` にある通り、`/injected/kcs/dsnapshot:remove` が稀に届かずコンテナが残留する事象が報告されている。暫定措置としてユーザー確認ダイアログによる手動除去を実装。
- タブキャプチャは `chrome.tabs.captureVisibleTab` 依存のため、Chrome 権限やタブ状態により失敗する可能性がある。失敗時の再試行ロジックは未実装。
- `canvas` 探索は最初の `querySelector` 失敗時に例外化する (`!` 断言)。DOM 構造変更時はエラーとなるため要監視。

## 今後の改善候補
- `/injected/kcs/dsnapshot:remove` の到達を ACK 付きで保証し、未到達時は背景側から再送するか、フロント側でタイムアウト自動解除を行う。
- `DamageSnapshot` が `canvas` 要素を再取得する経路を用意し、ゲーム DOM 変化時にオーバーレイが保護されるよう MutationObserver 等で追従する。
- キャプチャ処理が失敗した場合に最大リトライ回数・失敗通知を設け、ユーザーが手動で確認できるサイドチャネル (例: 拡張アイコンバッジ) を提供する。
- 切り抜き領域や表示位置を設定化し、連合艦隊第 2 艦隊の詳細表示やユーザーカスタマイズ (反転・拡大率調整) に対応させる。
- 一時的な画像ロード中はスケルトンやローディング状態を表示し、空のコンテナが残る時間を最小化する。
