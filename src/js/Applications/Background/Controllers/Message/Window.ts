/**
 * Window.ts
 * このファイルで定義されるコントローラ群は、
 * ゲーム窓の作成、ダッシュボード窓の作成、
 * それぞれの位置の記憶など、
 * backgroundからの窓の操作などを担います。
 */

import {Client} from "chomex";
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
  const id = message.id;
  const frame = Frame.find<Frame>(id) || Frame.latest();
  let tab = await ws.find();
  if (!!tab) {
    tab = await ws.reconfigure(tab, frame);
    return Client.for(chrome.tabs, tab.id).message("/reconfigured", {frame});
  }
  frame.update({selectedAt: Date.now()});
  tab = await ws.create(frame);
  // tab = await ws.zoom(tab, 1.0);
  return tab;
}

/**
 * このリクエストをした窓が『艦これウィジェット』経由で開かれたものなのかを確認。
 * 必要な設定などをまとめて返す。
 */
export async function WindowDecoration(message: any) {
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
  return {...launched, configs};
}

export async function WindowRecord(message: any) {
  const frame = Frame.find(message.frame.id);
  const ws = WindowService.getInstance();
  const win = await ws.get(this.sender.tab.windowId);
  return frame.update({position: {left: win.left, top: win.top}});
}

export async function WindowToggleMute(message: any) {
  const tab: chrome.tabs.Tab = this.sender.tab;
  const ws = WindowService.getInstance();
  const res = await ws.mute(tab, !tab.mutedInfo.muted);
  return res;
}
