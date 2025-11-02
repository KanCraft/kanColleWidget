# OCR 時刻検出の設計判断記録

## 概要

艦これウィジェットでは、入渠・建造などの残り時間を OCR で読み取り通知する機能を提供している。従来はコンテンツスクリプト (`src/injection/dmm.ts`) 側で Tesseract.js を起動していたが、2025 年 10 月時点で `chrome.offscreen` へ処理を移す検討を実施した。本ドキュメントでは、その経緯と結論を整理する。

## Offscreen へ移行を検討した理由

- コンテンツスクリプトに集中している OCR 処理を切り離し、UI 周辺コードの責務を軽量化する。
- サービスワーカーがスリープするケースを避け、長時間の OCR 処理を安定稼働させたい。
- 入渠・建造・ダメージスナップショットなど複数の OCR パイプラインを統合し、キュー制御などを一元化する余地がある。

## 実施した取り組み

- `OffscreenDocumentManager` を導入し、音声再生と同様に OCR 用 offscreen ドキュメントを起動する仕組みを追加。
- `tessworker.min.js` と学習データ (`tessdata-4.0.0_best_int/*`) を `web_accessible_resources` に登録。
- `tesseract-core` の wasｍ 資産を拡張内にコピーし、`corePath` から参照できるように調整。
- `createWorker` の `workerPath` を `chrome.runtime.getURL(...)`、Blob URL、ラッパーワーカー (`offscreen/ocr-worker.js`) など複数の手段で指定する試行を実施。

## 直面した問題

いずれの方法でも offscreen の Worker 内で `importScripts` が `NetworkError` を返し、`tessworker.min.js` のロードが成功しなかった。主な失敗ログは以下の通り。

- `Failed to execute 'importScripts' on 'WorkerGlobalScope': The script at 'chrome-extension://.../tessworker.min.js' failed to load.`
- Blob URL 経由 (`blob:chrome-extension://...`) でも同様に `importScripts` が失敗。
- ラッパーワーカー (`offscreen/ocr-worker.js`) 自体を Worker として読み込もうとしても 404 扱いになり、実行に至らない。

ブラウザで直接 URL を開くとリソースは表示できるが、offscreen Worker から参照すると 404 扱いになる状況を解消できていない。

## 未検証のアプローチ

- `createWorker` を使わず `Tesseract.setWorkerPath` / `setCorePath` 等の低レベル API で初期化する案。
- `web_accessible_resources` の `matches` を見直し、offscreen 用に追加のパターンを用意する。
- Vite の出力構成を変更し、`tessworker.min.js` を offscreen HTML と同階層に配置する。
- 既存事例の調査や Chromium 側の制約の精査。

## 結論

- 現時点で offscreen への移行は成功しておらず、コンテンツスクリプトからの OCR 呼び出しに比べてメリットよりリスクが大きい。
- 仕様上の明確な制約が解消できるまでは、従来の `src/injection/dmm.ts` で OCR を実行する設計を維持する。
- Offscreen 側で Tesseract を動かす可能性は将来的に再検討するが、十分な検証と PoC が整うまでは機能を移行しない。

## 今後の方針

1. 従来設計を前提に保守・機能追加を行う。
2. Offscreen での OCR を再検討する際は、上記未検証のアプローチを個別に試し、再発防止策を整理する。
3. ドキュメントやコード内に、現段階では `dmm.ts` での OCR 実装が唯一の安定手段である旨を明記する。
