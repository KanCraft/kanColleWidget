/**
 * Window.ts
 * このファイルで定義されるコントローラ群は、
 * ゲーム窓の作成、ダッシュボード窓の作成、
 * それぞれの位置の記憶など、
 * backgroundからの窓の操作などを担います。
 */

import WindowService from "../../../../Services/Window";
import Config from "../../../Models/Config";
import Frame from "../../../Models/Frame";

/**
 * WindowOpen
 * すでにあれば、指定されたフレーム情報にリサイズする.
 * なければ、指定されたフレームか、最後に指定されたフレームにリサイズする.
 */
export async function WindowOpen(message: any) {
  const ws = WindowService.getInstance();
  return await ws.backToGame(message);
}

/**
 * このリクエストをした窓が『艦これウィジェット』経由で開かれたものなのかを確認。
 * 必要な設定などをまとめて返す。
 */
export async function WindowDecoration(/* message: any */) {
  const ws = WindowService.getInstance();
  const launched = ws.knows(this.sender.tab.id);
  if (!launched) {
    return Promise.reject({status: 404});
  }
  // 必要な設定があればそれを返す
  const configs = Config.select([
    "inapp-mute-button",
    "inapp-screenshot-button",
  ]);
  await ws.zoom(launched.tab, 1);
  return {...launched, configs};
}

export async function WindowRecord(message: any) {
  const frame = Frame.find(message.frame.id);
  const ws = WindowService.getInstance();
  const win = await ws.get(this.sender.tab.windowId);
  return frame.update({position: {left: win.left, top: win.top}});
}

export async function WindowToggleMute(/* message: any */) {
  const tab: chrome.tabs.Tab = this.sender.tab;
  const muted = !tab.mutedInfo.muted;
  const ws = WindowService.getInstance();
  const res = await ws.mute(tab, muted);
  Frame.latest().update({ muted });
  return res;
}

export async function OpenOptionsPage(/* message: any */) {
  const ws = WindowService.getInstance();
  return ws.openOptionsPage();
}

export async function OpenDeckCapturePage(/* message: any */) {
  const ws = WindowService.getInstance();
  return ws.openDeckCapturePage();
}

export async function OpenDashboardPage() {
  const ws = WindowService.getInstance();
  return ws.openDashboardPage();
}