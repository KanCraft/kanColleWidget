import {
  SequentialRouter,
} from "chromite";
import { Logger } from "../../logger";

import {
  onPort,
  onMissionStart,
  onMissionReturnInstruction,
  onMissionResult,
  onRecoveryStart,
  onMapStart,
  onBattleStarted,
  onCombinedBattleStarted,
  onCreateShip,
  onGetShip,
  onBattleResulted,
  onMapNext,
  onMidnightBattleStarted,
  onSpMidnightBattleStarted,
  onCombinedSpMidnightBattleStarted,
} from "./kcsapi";
import { onQuestStart, onQuestStop, onQuestComplete, onPracticePrepare, onSortiePrepare } from "./quest";
import { ScriptingService } from "../../services/ScriptingService";

const requestLogger = Logger.get("WebRequest");
const completeLogger = Logger.get("WebRequest:onComplete");

const onBeforeRequest = new SequentialRouter<typeof chrome.webRequest.onBeforeRequest>(2, async (details) => {
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
onBeforeRequest.on(["/kcsapi/api_req_combined_battle/battle"], onCombinedBattleStarted); // 連合艦隊戦が開始されたとき(#1764)
onBeforeRequest.on(["/kcsapi/api_req_sortie/battleresult"], onBattleResulted); // 戦闘結果を回収しようとしたとき
onBeforeRequest.on(["/kcsapi/api_req_map/next"], onMapNext); // マップ移動をしたとき
onBeforeRequest.on(["/kcsapi/api_req_battle_midnight/battle"], onMidnightBattleStarted); // 昼戦マスからの追撃夜戦に突入したとき
onBeforeRequest.on(["/kcsapi/api_req_battle_midnight/sp_midnight"], onSpMidnightBattleStarted); // 開幕夜戦マスの戦闘が開始されたとき(#1764)
// 連合艦隊の開幕夜戦。パス未観測のため予防的登録（実機確認まで挙動は未保証）(#1764)
onBeforeRequest.on(["/kcsapi/api_req_combined_battle/sp_midnight"], onCombinedSpMidnightBattleStarted);

onBeforeRequest.on([
  '/kcsapi/api_req_kousyou/createship',
  '/kcsapi/api_get_member/kdock',
], onCreateShip); // 新造艦を作成しようとしたとき
onBeforeRequest.on(["/kcsapi/api_req_kousyou/getship"], onGetShip); // 建造した艦を受け取ったとき

// 任務
onBeforeRequest.on(["/kcsapi/api_req_quest/start"], onQuestStart); // 任務を受託したとき
onBeforeRequest.on(["/kcsapi/api_req_quest/stop"], onQuestStop); // 任務を放棄したとき
onBeforeRequest.on(["/kcsapi/api_req_quest/clearitemget"], onQuestComplete); // 任務報酬を受け取ったとき

onBeforeRequest.onNotFound(async (details) => {
  requestLogger.debug("-", details);
});

const onComplete = new SequentialRouter<typeof chrome.webRequest.onCompleted>(2, async (details) => {
  const url = new URL(details.url);
  return { __action__: url.pathname };
});

onComplete.on(["/kcsapi/api_start2/getData"], async ([details]) => {
  const s = new ScriptingService();
  await s.js({
    tabId: details.tabId,
    frameIds: [details.frameId],
  }, ["osapi.js"]);
});

onComplete.on(["/kcsapi/api_req_sortie/battleresult"], async ([details]) => {
  const timestamp = Date.now();
  completeLogger.debug("api_req_sortie/battleresult", details);
  chrome.tabs.sendMessage(details.tabId, { __action__: "/injected/kcs/dsnapshot:prepare", count: 1, timestamp }, {
    frameId: details.frameId,
  });
});
onComplete.on(["/kcsapi/api_req_combined_battle/battleresult"], async ([details]) => {
  const timestamp = Date.now();
  completeLogger.debug("api_req_combined_battle/battleresult", details);
  chrome.tabs.sendMessage(details.tabId, { __action__: "/injected/kcs/dsnapshot:prepare", count: 2, timestamp }, {
    frameId: details.frameId,
  });
});

onComplete.on([
  "/kcsapi/api_port/port",
  "/kcsapi/api_get_member/ndock"
], async () => {
  chrome.notifications.getAll((notifications) => {
    for (const id in notifications) {
      if (id.startsWith("/recovery")) chrome.notifications.clear(id);
    }
  });
})

onComplete.on(["/kcsapi/api_get_member/practice"], onPracticePrepare); // 演習画面に遷移したとき
onComplete.on(["/kcsapi/api_get_member/mapinfo"], onSortiePrepare); // 出撃準備画面に遷移したとき

export {
  onBeforeRequest,
  onComplete,
};
