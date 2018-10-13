import {Client} from "chomex";
import WindowService from "../../../../Services/Window";
import DamageSnapshotFrame, { DamageSnapshotType } from "../../../Models/DamageSnapshotFrame";
import Sortie from "../../../Models/Sortie";

/**
 * 通常海域において、
 * 戦闘が終了したときに呼ばれるコントローラ
 */
export async function OnBattleResulted(req: chrome.webRequest.WebResponseCacheDetails) {

  const text = Sortie.context().toText();

  // 別の画像をdrawしないように、ユニークっぽいkeyを生成しておく
  const key = Date.now();

  // 画面のクリックイベントに備えてもらう
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/prepare", {count: 1, key, text});

  // {{{ TODO: このへんのルーチンどうにかすべきかな
  const d = DamageSnapshotFrame.get();
  if (d.value === DamageSnapshotType.Separate) {
    WindowService.getInstance().openDamageSnapshot(d, 1, key, text);
  }
  // }}}

  return {status: 200};
}

export async function OnCombinedBattleResulted(req: chrome.webRequest.WebResponseCacheDetails) {

  const text = Sortie.context().toText();

  // 別の画像をdrawしないように、ユニークっぽいkeyを生成しておく
  const key = Date.now();

  // 画面のクリックイベントに備えてもらう
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/prepare", {count: 2, key, text});

  // {{{ TODO: このへんのルーチンどうにかすべきかな
  const d = DamageSnapshotFrame.get();
  if (d.value === DamageSnapshotType.Separate) {
    WindowService.getInstance().openDamageSnapshot(d, 2, key, text);
  }
  // }}}

  return {status: 200};
}

export async function OnBattleStarted(req: chrome.webRequest.WebRequestBodyDetails) {

  Sortie.context().battle();

  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/remove");
  WindowService.getInstance().cleanDamageSnapshot();
  return {status: 200};
}

export async function OnAirBattleStarted(req: chrome.webRequest.WebRequestBodyDetails) {

  Sortie.context().battle();

  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/remove");
  WindowService.getInstance().cleanDamageSnapshot();
  return {status: 200};
}
