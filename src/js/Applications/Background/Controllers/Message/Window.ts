/**
 * Window.ts
 * このファイルで定義されるコントローラ群は、
 * ゲーム窓の作成、ダッシュボード窓の作成、
 * それぞれの位置の記憶など、
 * backgroundからの窓の操作などを担います。
 */

import WindowService from "../../../../Services/Window";
import Frame from "../../../Models/Frame";
import DashboardFrame from "../../../Models/DashboardFrame";
import { Screenshot } from "./Capture"; // XXX: コントローラからコントローラ呼ぶのってアリかなあ...
import InAppButtonSetting from "../../../Models/Settings/InAppButtonSetting";

/**
 * WindowOpen
 * @MESSAGE /window/open
 * すでにあれば、指定されたフレーム情報にリサイズする.
 * なければ、指定されたフレームか、最後に指定されたフレームにリサイズする.
 * @param {string} message.id FrameモデルのID
 */
export async function WindowOpen(message: { id?: string } = {}): Promise<chrome.tabs.Tab> {
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
  const setting = InAppButtonSetting.user();
  await ws.zoom(launched.tab, 1);
  return { ...launched, setting };
}

/**
 * @MESSAGE /window/record
 * @param {{width: number, height: number}} message.frame.size
 * @param {{left: number, top: number}} message.frame.position
 */
export async function WindowRecord(message: any) {
  const frame = Frame.latest();
  return frame.update({ ...message.frame, alias: "MEMORY" });
}

export async function WindowToggleMute(/* message: any */) {
  const ws = WindowService.getInstance();
  const tab: chrome.tabs.Tab = this.sender.tab || await ws.find(true);
  const muted = !tab.mutedInfo.muted;
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
  const frame = DashboardFrame.user();
  return ws.openDashboardPage(frame);
}

export async function OpenArchivePage() {
  return WindowService.getInstance().openArchivePage();
}

/**
 * @MESSAGE /window/current-tab
 */
export async function GetCurrentGameTab() {
  const tab = await WindowService.getInstance().find();
  return { status: tab ? 200 : 404, tab };
}

/**
 * @MESSAGE /window/action
 */
export async function CurrentAction() {
  const tab = await WindowService.getInstance().find();
  return tab ? Screenshot({open:true}) : WindowOpen();
}
