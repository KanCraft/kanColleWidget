import { Router } from "chromite";
import { Launcher } from "../services/Launcher";
import { KanColleURL } from "../constants";

/**
 * ゲーム画面のナビゲーションを検知し、失われたコンテンツスクリプトを再注入する。
 *
 * MV3 では scripting.executeScript で注入した dmm.js はリロードで失われ、
 * 窓のサイズ調整（resize）・操作ボタン・OCR リスナーがすべて停止する（Issue #1784）。
 *
 * かつては初回ロードとの二重注入を避けるため transitionType === "reload" のみを
 * 対象にしていたが、PC 休止からの復帰などブラウザ主導の再読み込みでは
 * transitionType が "reload" にならないことがあり、再注入が発火せず
 * 窓ずれ・スクロールバーが残るケースがあった（Issue #1845）。
 * 二重注入は Launcher.activate() の check-and-set で防がれるようになったため、
 * トップフレームのゲーム URL へのコミット全般を対象にして取りこぼしを無くす。
 */
const onCommitted = new Router<typeof chrome.webNavigation.onCommitted>(async (details) => {
  const isGameNavigation = details.frameId === 0
    && details.url.startsWith(KanColleURL);
  return { __action__: isGameNavigation ? "/game/navigated" : "/ignore" };
});

onCommitted.on("/game/navigated", async (details) => {
  const launcher = new Launcher();
  // 拡張自身が開いた別窓（popup）かを確認し、所有権スコープ外の普通のタブには波及させない
  const win = await launcher.find();
  if (!win || win.tabs?.[0]?.id !== details.tabId) return;
  // 内側 iframe のロード待ちがタイムアウトしても Service Worker 側で握りつぶす
  await launcher.reactivate(win).catch((err) => {
    console.warn("[KCW] ゲーム窓の再活性化に失敗しました:", err);
  });
});

// ゲーム画面以外のナビゲーションは無視する
onCommitted.onNotFound(async () => { /* noop */ });

export {
  onCommitted,
};
