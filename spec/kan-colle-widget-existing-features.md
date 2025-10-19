# Feature Specification: 艦これウィジェット v4 既存機能

**Feature Branch**: `[docs-existing-features]`  
**Created**: 2025-10-19  
**Status**: Draft  
**Input**: User description: "既存実装の仕様整理"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 別窓起動とフレーム管理 (Priority: P1)

利用者が拡張のポップアップから任意のフレーム設定を選び、艦これを専用ウィンドウで起動できる。ウィンドウの位置・サイズは自動追跡され、再起動時に反映される。

**Why this priority**: ゲームプレイの入口であり、ここが動かないと他機能を利用できない。

**Independent Test**: ポップアップでフレームを選択し、期待どおりのサイズとズームで単独ウィンドウが起動するかを確認する。

**Acceptance Scenarios**:

1. **Given** 拡張がインストール済みで `Frame` 設定が存在する, **When** ポップアップで任意のフレームを選択する, **Then** 指定サイズのポップアップウィンドウが生成され `Launcher` が `dmm.js` とスタイルを適用する。
2. **Given** 別窓が起動済みでユーザがサイズや位置を変更した, **When** 10 秒ごとに `/frame/memory:track` が送信される, **Then** `Frame.memory()` が更新され次回起動時に最新の位置とサイズが反映される。

---

### User Story 2 - タイマー自動登録と通知 (Priority: P1)

遠征・修復・建造・疲労の状況を自動検知してタイマーを登録し、完了前に通知する。必要に応じてコンテンツのスクリーンショットを OCR し、正しい残り時間を取得する。

**Why this priority**: タイマー通知が本拡張の主要価値であり、失敗はゲームプレイの損失に直結する。

**Independent Test**: テスト用アカウントで各 API 呼び出しを発生させ、`Queue` 生成・通知発火・通知消去を Chrome デベロッパーツールで確認する。

**Acceptance Scenarios**:

1. **Given** `/kcsapi/api_req_mission/start` が送信される, **When** 背景ページの `onMissionStart` が発火する, **Then** 遠征時間に基づく `Queue` エントリが保存され開始通知が 6 秒後に自動消去される。
2. **Given** `/kcsapi/api_req_nyukyo/start` または `/kcsapi/api_req_kousyou/createship` が呼ばれる, **When** 対応コントローラがスクリーンショットを取得し `CropService` で切り抜く, **Then** OCR 結果の時刻で `Queue` が生成され、開始通知が表示・消去される。
3. **Given** 疲労を引き起こす出撃 `/kcsapi/api_req_map/start` が送信される, **When** `onMapStart` が処理する, **Then** 15 分後を予定時刻とする疲労 `Queue` が登録され大破防止表示が整合する。
4. **Given** 遠征完了 API `/kcsapi/api_req_mission/result` が完了する, **When** コントローラが通知一覧を確認する, **Then** 対応する遠征通知が削除される。

---

### User Story 3 - ダッシュボード監視と手動調整 (Priority: P2)

ユーザは専用ダッシュボードで現在時刻、ウィンドウ状態、登録済みタイマーを一覧でき、必要に応じて手動で編集・削除できる。

**Why this priority**: 自動登録に失敗した場合のフォールバックと進行状況の可視化により、通知機能の信頼性を補完する。

**Independent Test**: `Launcher.dashboard()` でダッシュボードを開き、`QueuesView` からタイマー編集・削除が反映されるかを確認する。

**Acceptance Scenarios**:

1. **Given** ダッシュボードを開く, **When** ローダーが `Queue.list()` と `Launcher.find()` を取得する, **Then** タイマー一覧とサウンド・スクリーンショット制御が描画され時刻が 1 秒ごとに更新される。
2. **Given** 任意のタイマー行をクリックする, **When** `CustomQueueModal` にて種別・対象・予定時刻を編集して保存する, **Then** `Queue` が更新されダッシュボード表示がリフレッシュされる。
3. **Given** 疲労タイマーをクリックする, **When** `FatigueQueueView` が `Queue.delete()` を呼ぶ, **Then** エントリが削除され次回の `QueueWatcher` で通知対象外になる。

---

### User Story 4 - ゲーム内補助 UI と被害防止 (Priority: P3)

ゲーム iframe 内にミュート・スクリーンショットボタンと大破進撃防止オーバーレイを提供し、画面遷移や押下のタイミングを安全に誘導する。

**Why this priority**: 直接操作するユーザインターフェースに統合することで、別ウィンドウでも利便性と安全性を確保する。

**Independent Test**: `kcs.ts` と `dmm.ts` を注入した状態で戦闘を実行し、オーバーレイ表示とボタン操作が期待どおりに作用するかを確認する。

**Acceptance Scenarios**:

1. **Given** ゲーム専用ウィンドウを起動する, **When** `InAppActionButtons` が描画される, **Then** 右上ホバーでボタンが表示されスクリーンショット取得・ミュート切替がバックグラウンド経由で実行される。
2. **Given** 戦闘結果 API `/kcsapi/api_req_sortie/battleresult` が完了する, **When** 背景が `/damage-snapshot/capture` を指示し `CropService` がダメージ領域を切り抜く, **Then** ゲーム画面に大破確認オーバーレイが表示されクリックで除去できる。

---

### Edge Cases

- OCR 結果が `hh:mm:ss` 形式でない場合は `Queue` を生成できず、ユーザへの明示的な再入力手段がない。エラー通知や手動入力導線が必要。
- `QueueWatcher` 実行時点で `scheduled` が過去のエントリは直ちに通知されるため、不要な過去エントリが大量に残ると同時通知が発生する。
- `Launcher.find()` がウィンドウを見つけられない状態でサウンド操作やスクリーンショットを要求すると、ユーザは失敗理由を把握しづらい。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: システムはポップアップ選択時に `Launcher.launch` を通じて指定 `Frame` 設定を適用したポップアップウィンドウを生成しなければならない。
- **FR-002**: システムは `dmm.js` 内で 10 秒間隔の `/frame/memory:track` メッセージを発行し、`Frame.memory()` に位置とサイズを persisted storage へ保存しなければならない。
- **FR-003**: システムは `chrome.webRequest` で艦これ API を監視し、遠征・修復・建造・疲労の各イベント発生時に `Queue.create` を呼び出し予定時刻を設定しなければならない。
- **FR-004**: システムはタイマー登録時に開始通知を生成し、6 秒後に自動消去し、完了 API を受信した際は関連通知を確実に `chrome.notifications.clear` しなければならない。
- **FR-005**: システムは修復・建造のタイマー取得で `CropService` を用いた領域切り抜きと `tesseract.js` での OCR を実行し、結果テキストを `hh:mm:ss` として `Queue` に変換しなければならない。
- **FR-006**: システムはダッシュボードで `QueuesView` を提供し、各エントリの編集・保存・削除操作が `Queue.save` / `Queue.delete` に反映される必要がある。
- **FR-007**: システムは戦闘終了後に `/damage-snapshot/capture` メッセージから切り抜いた画像を `kcs.ts` へ送信し、大破進撃防止オーバーレイを表示・解除できなければならない。
- **FR-008**: システムはオプションページで艦これサーバ一覧を表示し、`PermissionsService` を通じて `<all_urls>` および各サーバ origin の許可/取り消しを操作できなければならない。

### Key Entities *(include if feature involves data)*

- **Frame**: 別窓のレイアウト・ズーム・位置情報を保持する永続モデル。`memory`・`original`・`small` のプリセットとユーザ定義エントリを扱う。
- **Queue**: タイマーアラートの永続モデル。`type`, `params`, `scheduled` を保持し、`entry()` メソッドで具体的な `Mission`/`Recovery`/`Shipbuild`/`Fatigue` オブジェクトを生成する。
- **Entry オブジェクト**: 各種信息の通知 payload を構築するクラス群。`$n.id()` と `$n.options()` で通知 ID と表示内容を定義する。
- **ReleaseNoteObject**: オプションページの開発情報表示に用いる JSON 構造。リリース履歴・コミット一覧・告知メッセージを持つ。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 遠征開始 API 受信から 1 秒以内に対応する `Queue` レコードが Chrome ストレージに生成されること。
- **SC-002**: ダッシュボード上の現在時刻表示が開いている間は 1 秒ごとに更新され、5 分連続稼働で遅延が 500 ms 未満であること。
- **SC-003**: 登録済み各タイマーは予定時刻の最大 5 秒前までに Chrome 通知が表示され、ユーザ操作なしでも通知が 6 秒以内に自動消去されること。
- **SC-004**: 修復・建造タイマーの OCR は 90% 以上のケースで 2 秒以内に完了し、失敗時にはダッシュボードで手動入力できること。
- **SC-005**: 大破進撃防止オーバーレイは該当 API 完了後 2 秒以内に表示され、ユーザがクリックまたは `/injected/kcs/dsnapshot:remove` 受信後 1 秒以内に非表示となること。
