---
date: 2025-10-21
kind: decision
principles: [non-intrusive]
---

# 大破進撃防止窓は、戦闘結果 API を合図に「次へ」のクリックで撮影し、損傷一覧を重ねて見せる

**Date**: 2025-10-21（改訂 2026-09-30: 表示モード、vh 指定、keepUntilNextShow を反映）
**Status**: Accepted。実装済み（v4.0.2 から）
**正本（コード）**: `src/injection/osapi.ts`（`DamageSnapshot`）、`src/controllers/WebRequest/index.ts`（`dsnapshot:prepare`）、`src/controllers/WebRequest/kcsapi.ts`（`dsnapshot:remove`）、`src/controllers/Message.ts`（撮影と表示モード別の返送）、`src/services/CropService.ts`（切り抜き比率）、`src/models/configs/DamageSnapshotConfig.ts` / `tests/dsnapshot-delivery.spec.ts`

## 決定

- 戦闘結果 API（通常 / 連合）を検知したら、ゲーム iframe に `dsnapshot:prepare` を送る。撮影回数は通常 1、連合艦隊 2。
- ユーザーが「次へ」をクリックしたら撮影を依頼し、背景で `captureVisibleTab` と切り抜きをしてから表示する。表示先はモードで変わる（`inapp` はゲーム内に重ねる、`separate` は別窓、`disabled` は出さない）。
- 消すのは、母港帰投と戦闘開始の `dsnapshot:remove`。ただし `keepUntilNextShow` が有効なら戦闘開始では消さず、次の表示で差し替える。
- 重ねた窓をクリックすると `window.confirm` で確かめてから消す。

## なぜ

- 撮影のタイミングは画面を見ずに決め打ちしている。戦闘終了から「次へ」が出るまで 7800ms はクリックを無視し、撮影は初回 1000ms、以後クリックごとに 800ms 遅らせる。演出が終わる前に撮ると損傷一覧が写らない。800ms 以内の連打は無視する（#1262）。
- 表示直後は必ず不透明にして存在に気づかせ、ユーザーがホバーしたあとだけ 2000ms で薄くする。プレイの邪魔をせず、見落としもさせないため。
- 高さは `vh` で与え、幅はアスペクト比に任せる。`height:100%` にすると画像の自然解像度がコンテナ幅に採用されて巨大化する。
- `confirm` での手動削除は、`dsnapshot:remove` がまれに届かず窓が残る事象への暫定策（`osapi.ts` の FIXME）。到達保証（ACK と再送）は未実装。
