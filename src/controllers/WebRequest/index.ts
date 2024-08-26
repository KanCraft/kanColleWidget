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
  onCreateShip,
} from "./kcsapi";

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

onBeforeRequest.on([
  '/kcsapi/api_req_kousyou/createship',
  '/kcsapi/api_get_member/kdock',
], onCreateShip); // 新造艦を作成しようとしたとき

onBeforeRequest.onNotFound(async (details) => {
  (new Logger("WebRequest")).warn("onNotFound", details);
});

export {
  onBeforeRequest,
};
