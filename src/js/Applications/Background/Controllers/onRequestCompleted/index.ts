import {Client} from "chomex";
import WindowService from "../../../../Services/Window";
import Config from "../../../Models/Config";
import DamageSnapshotFrame, { DamageSnapshotType } from "../../../Models/DamageSnapshotFrame";

/**
 * 通常海域において、
 * 戦闘が終了したときに呼ばれるコントローラ
 */
export async function onBattleResulted(req: chrome.webRequest.WebResponseCacheDetails) {
  // 画面のクリックイベントに備えてもらう
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/prepare", {count: 1});

  // {{{ TODO: このへんのルーチンどうにかすべきかな
  const d = DamageSnapshotFrame.get();
  if (d.value === DamageSnapshotType.Separate) {
    WindowService.getInstance().openDamageSnapshot(d, 1);
  }
  // }}}
}

export async function OnCombinedBattleResulted(req: chrome.webRequest.WebResponseCacheDetails) {
  // 画面のクリックイベントに備えてもらう
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/prepare", {count: 2});

  // {{{ TODO: このへんのルーチンどうにかすべきかな
  const d = DamageSnapshotFrame.get();
  if (d.value === DamageSnapshotType.Separate) {
    WindowService.getInstance().openDamageSnapshot(d, 2);
  }
  // }}}
}
