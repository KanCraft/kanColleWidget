import { Router } from "chromite";
import { Launcher } from "../services/Launcher";
import { KanColleURL } from "../constants";

/**
 * ゲーム画面のナビゲーションを検知し、リロードで失われたコンテンツスクリプトを再注入する（#1784）。
 * ブラウザ主導の再読み込みでは transitionType が "reload" にならないことがあるため、
 * 種別では絞らずトップフレームのゲーム URL へのコミット全般を対象にする（#1845）。
 * 初回ロードと重なっても、二重注入は Launcher.activate() の check-and-set が防ぐ。
 * 経緯の詳細は ADR 0002。
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
