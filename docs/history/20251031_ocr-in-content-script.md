---
date: 2025-10-31
kind: decision
principles: []
---

# OCR は content script（dmm.ts）で実行し、offscreen には移さない

**Date**: 2025-10-31
**Status**: Accepted。offscreen 版は試作のみで、コードには残っていない
**正本（コード）**: `src/injection/dmm.ts` と `src/injection/ocrWorker.ts`（Tesseract の起動）、`src/controllers/Message.ts`（結果の受信と登録）、`src/offscreen/offscreen.ts`（offscreen は音声再生だけ）/ `tests/ocr-worker-reuse.spec.ts`、`tests/ocr-request.spec.ts`

## 決定

- 入渠・建造の残り時間の OCR は、ゲーム窓に注入した content script で Tesseract.js を動かして行う。背景は撮影・切り抜き・依頼と、結果の受信だけを受け持つ。
- `tessworker.min.js`、学習データ、`tesseract-core` の wasm は拡張に同梱し、`chrome.runtime.getURL` で参照する。

## なぜ

- 2025-10 に OCR を offscreen document へ移す試作をした（背景の責務を集め、Service Worker の停止に左右されないようにする狙い）。しかし offscreen の Worker からは `importScripts` が `NetworkError` になり、`chrome.runtime.getURL`、Blob URL、ラッパー Worker のどれでも `tessworker.min.js` を読めなかった。
- 解消できる見込みが立たないまま移すのはリスクが大きいので、動いている content script 方式を維持した。
- 再挑戦するときの未検証の案: `setWorkerPath` / `setCorePath` 等の低レベル API で初期化する、`web_accessible_resources` の `matches` を見直す、`tessworker.min.js` を offscreen HTML と同じ階層に出力する。
