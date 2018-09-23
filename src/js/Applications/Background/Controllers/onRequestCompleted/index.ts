import {Client} from "chomex";
import WindowService from "../../../../Services/Window";
import Config, {DamageSnapshot} from "../../../Models/Config";

/**
 * 通常海域において、
 * 戦闘が終了したときに呼ばれるコントローラ
 */
export async function onBattleResulted(req: chrome.webRequest.WebResponseCacheDetails) {
  // 画面のクリックイベントに備えてもらう
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/prepare", {count: 1});

  // TODO: このへんのルーチンどうにかすべきかな
  // const c = Config.find<Config<string>>("damagesnapshot");
  // if (c.value === DamageSnapshot.Separate) {
  WindowService.getInstance().openDamageSnapshot({count: 1});
  // }
}

export async function OnCombinedBattleResulted(req: chrome.webRequest.WebResponseCacheDetails) {
  // 画面のクリックイベントに備えてもらう
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/prepare", {count: 2});

  // TODO: このへんのルーチンどうにかすべきかな
  // const c = Config.find<Config<string>>("damagesnapshot");
  // if (c.value === DamageSnapshot.Separate) {
  WindowService.getInstance().openDamageSnapshot({count: 2});
  // }
}
