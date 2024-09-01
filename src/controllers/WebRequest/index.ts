import {
  Logger,
  SequentialRouter,
} from "chromite";

import {
  onPort,
  onMissionStart,
  onMissionReturnInstruction,
  onMissionResult,
  onRecoveryStart,
  onMapStart,
  onBattleStarted,
  onCreateShip,
} from "./kcsapi";
import { ScriptingService } from "../../services/ScriptingService";

const onBeforeRequest = new SequentialRouter<chrome.webRequest.WebRequestBodyEvent>(2, async (details) => {
  const url = new URL(details.url);
  return { __action__: url.pathname };
});

onBeforeRequest.on(["/kcsapi/api_port/port"], onPort);
onBeforeRequest.on(["/kcsapi/api_req_mission/start"], onMissionStart); // 遠征に出したとき
onBeforeRequest.on(["/kcsapi/api_req_mission/return_instruction"], onMissionReturnInstruction); // 遠征帰還命令出したとき
onBeforeRequest.on(["/kcsapi/api_req_mission/result"], onMissionResult); // 遠征結果の回収をしたとき
onBeforeRequest.on(["/kcsapi/api_req_nyukyo/start"], onRecoveryStart); // 修復用の入渠をしようとしたとき
onBeforeRequest.on(["/kcsapi/api_req_map/start"], onMapStart); // 出撃をしようとしたとき
onBeforeRequest.on(["/kcsapi/api_req_sortie/battle"], onBattleStarted); // 戦闘が開始されたとき

onBeforeRequest.on([
  '/kcsapi/api_req_kousyou/createship',
  '/kcsapi/api_get_member/kdock',
], onCreateShip); // 新造艦を作成しようとしたとき

onBeforeRequest.onNotFound(async (details) => {
  (new Logger("WebRequest")).warn("onNotFound", details);
});

const onComplete = new SequentialRouter<chrome.webRequest.WebResponseCacheEvent>(2, async (details) => {
  const url = new URL(details.url);
  return { __action__: url.pathname };
});

onComplete.on(["/kcsapi/api_start2/getData"], async ([details]) => {
  (new Logger("onComplete")).info("api_start2/getData", details);
  const s = new ScriptingService();
  await s.js({
    tabId: details.tabId,
    frameIds: [details.frameId],
  }, ["kcs.js"]);
});

onComplete.on(["/kcsapi/api_req_sortie/battleresult"], async ([details]) => {
  const timestamp = Date.now();
  new Logger("onComplete").info("api_req_sortie/battleresult", details);
  chrome.tabs.sendMessage(details.tabId, { __action__: "/injected/kcs/dsnapshot:prepare", count: 1, timestamp }, {
    frameId: details.frameId,
  });
});
onComplete.on(["/kcsapi/api_req_combined_battle/battleresult"], async ([details]) => {
  const timestamp = Date.now();
  new Logger("onComplete").info("api_req_combined_battle/battleresult", details);
  chrome.tabs.sendMessage(details.tabId, { __action__: "/injected/kcs/dsnapshot:prepare", count: 2, timestamp }, {
    frameId: details.frameId,
  });
});

export {
  onBeforeRequest,
  onComplete,
};
