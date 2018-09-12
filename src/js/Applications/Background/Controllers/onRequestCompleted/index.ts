import {Client} from "chomex";

/**
 * 通常海域において、
 * 戦闘が終了したときに呼ばれるコントローラ
 */
export async function onBattleResulted(req: chrome.webRequest.WebResponseCacheDetails) {
  // 画面のクリックイベントに備えてもらう
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/prepare");
}
