import {Client} from "chomex";
import WindowService from "../../../../Services/Window";
import DamageSnapshotFrame, { DamageSnapshotType } from "../../../Models/DamageSnapshotFrame";

/**
 * 通常海域において、
 * 戦闘が終了したときに呼ばれるコントローラ
 */
export async function OnBattleResulted(req: chrome.webRequest.WebResponseCacheDetails) {

  // 別の画像をdrawしないように、ユニークっぽいkeyを生成しておく
  const key = Date.now();

  // 画面のクリックイベントに備えてもらう
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/prepare", {count: 1, key});

  // {{{ TODO: このへんのルーチンどうにかすべきかな
  const d = DamageSnapshotFrame.get();
  if (d.value === DamageSnapshotType.Separate) {
    WindowService.getInstance().openDamageSnapshot(d, 1, key);
  }
  // }}}

  return {status: 200};
}

export async function OnCombinedBattleResulted(req: chrome.webRequest.WebResponseCacheDetails) {

  // 別の画像をdrawしないように、ユニークっぽいkeyを生成しておく
  const key = Date.now();

  // 画面のクリックイベントに備えてもらう
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/prepare", {count: 2, key});

  // {{{ TODO: このへんのルーチンどうにかすべきかな
  const d = DamageSnapshotFrame.get();
  if (d.value === DamageSnapshotType.Separate) {
    WindowService.getInstance().openDamageSnapshot(d, 2, key);
  }
  // }}}

  return {status: 200};
}

export async function OnBattleStarted(req: chrome.webRequest.WebRequestBodyDetails) {
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/remove");
  WindowService.getInstance().cleanDamageSnapshot();
  return {status: 200};
}

export async function OnAirBattleStarted(req: chrome.webRequest.WebRequestBodyDetails) {
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/remove");
  WindowService.getInstance().cleanDamageSnapshot();
  return {status: 200};
}
