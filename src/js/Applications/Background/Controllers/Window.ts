/**
 * Window.ts
 * このファイルで定義されるコントローラ群は、
 * ゲーム窓の作成、ダッシュボード窓の作成、
 * それぞれの位置の記憶など、
 * backgroundからの窓の操作などを担います。
 */

import {Client} from "chomex";
import WindowService from "../../../Services/Window";
import Frame from "../Models/Frame";

/**
 * WindowOpen
 * すでにあれば、指定されたフレーム情報にリサイズする.
 * なければ、指定されたフレームか、最後に指定されたフレームにリサイズする.
 */
export async function WindowOpen(message: any) {
  const wins = WindowService.getInstance();
  const id = message.id;
  const frame = Frame.find<Frame>(id) || Frame.latest();
  let tab = await wins.find();
  if (!!tab) {
    tab = await wins.reconfigure(tab, frame);
    return Client.for(chrome.tabs, tab.id).message("/reconfigured", {frame});
  }
  frame.update({selectedAt: Date.now()});
  tab = await wins.create(frame);
  return tab;
}

/**
 * WindowDecoration
 */
export async function WindowDecoration(message: any) {
  const wins = WindowService.getInstance();
  const launched = wins.knows(this.sender.tab.id);
  if (!launched) {
    return Promise.reject({status: 404});
  }
  return launched;
}

export async function WindowRecord(message: any) {
  const frame = Frame.find(message.frame.id);
  const wins = WindowService.getInstance();
  const win = await wins.get(this.sender.tab.windowId);
  return frame.update({position: {left: win.left, top: win.top}});
}
