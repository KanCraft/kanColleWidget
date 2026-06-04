import { Router } from "chromite";
import { Launcher } from "../services/Launcher";
import { KanColleURL } from "../constants";

/**
 * ゲーム画面のリロードを検知し、失われたコンテンツスクリプトを再注入する。
 *
 * MV3 では scripting.executeScript で注入した dmm.js はリロードで失われ、
 * 窓のサイズ調整（resize）・操作ボタン・OCR リスナーがすべて停止する（Issue #1784）。
 * 初回ロードとの二重注入を避けるため transitionType === "reload" のみを対象にする。
 */
const onCommitted = new Router<typeof chrome.webNavigation.onCommitted>(async (details) => {
  const isGameReload = details.frameId === 0
    && details.transitionType === "reload"
    && details.url.startsWith(KanColleURL);
  return { __action__: isGameReload ? "/game/reload" : "/ignore" };
});

onCommitted.on("/game/reload", async (details) => {
  const launcher = new Launcher();
  // 拡張自身が開いた別窓（popup）かを確認し、所有権スコープ外の普通のタブには波及させない
  const win = await launcher.find();
  if (!win || win.tabs?.[0]?.id !== details.tabId) return;
  await launcher.reactivate(win);
});

// リロード以外のナビゲーションは無視する
onCommitted.onNotFound(async () => { /* noop */ });

export {
  onCommitted,
};
