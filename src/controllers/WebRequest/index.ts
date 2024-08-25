import { Router } from "chromite";

import {
  onPort,
  onMissionStart,
  onMissionReturnInstruction,
  onMissionResult,
} from "./kcsapi";

const onBeforeRequest = new Router<chrome.webRequest.WebRequestBodyEvent>(async (details) => {
  const url = new URL(details.url);
  return { __action__: url.pathname };
});

onBeforeRequest.on("/kcsapi/api_port/port", onPort);
onBeforeRequest.on("/kcsapi/api_req_mission/start", onMissionStart); // 遠征に出したとき
onBeforeRequest.on("/kcsapi/api_req_mission/return_instruction", onMissionReturnInstruction); // 遠征帰還命令出したとき
onBeforeRequest.on("/kcsapi/api_req_mission/result", onMissionResult); // 遠征結果の回収をしたとき

onBeforeRequest.onNotFound(async (
  // detail: chrome.webRequest.WebRequestBodyDetails,
) => {
  // new Logger("notfound").warn("notfound", detail.url, detail);
});

export { onBeforeRequest };
