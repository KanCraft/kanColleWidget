import {Client} from "chomex";
import WindowService from "../../../../Services/Window";
import Sortie from "../../../Models/Sortie";
import DamageSnapshotSetting, { DamageSnapshotType } from "../../../Models/Settings/DamageSnapshotSetting";
import SortieContextSetting from "../../../Models/Settings/SortieContextSetting";

/**
 * 通常海域において、
 * 戦闘が終了したときに呼ばれるコントローラ
 */
export async function OnBattleResulted(req: chrome.webRequest.WebResponseCacheDetails) {

  const ctxSetting = SortieContextSetting.user();
  const text = Sortie.context().toText(ctxSetting.type);

  // 別の画像をdrawしないように、ユニークっぽいkeyを生成しておく
  const key = Date.now();

  // 画面のクリックイベントに備えてもらう
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/prepare", {count: 1, key, text});

  const setting = DamageSnapshotSetting.user();
  if (setting.type == DamageSnapshotType.Separate) {
    WindowService.getInstance().openDamageSnapshot(setting.toWindowCreateData(), 1, key, text);
  }

  return {status: 200};
}

export async function OnCombinedBattleResulted(req: chrome.webRequest.WebResponseCacheDetails) {

  const ctxSetting = SortieContextSetting.user();
  const text = Sortie.context().toText(ctxSetting.type);

  // 別の画像をdrawしないように、ユニークっぽいkeyを生成しておく
  const key = Date.now();

  // 画面のクリックイベントに備えてもらう
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/prepare", {count: 2, key, text});

  const setting = DamageSnapshotSetting.user();
  if (setting.type == DamageSnapshotType.Separate) {
    WindowService.getInstance().openDamageSnapshot(setting.toWindowCreateData(), 2, key, text);
  }

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
