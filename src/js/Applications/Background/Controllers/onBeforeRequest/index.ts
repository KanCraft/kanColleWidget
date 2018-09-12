import { Client } from "chomex/lib/Client";

export async function OnPort(req: chrome.webRequest.WebRequestBodyDetails) {
  /* tslint:disable no-console */
  console.log("on port", req);
}

export async function OnBattleStarted(req: chrome.webRequest.WebRequestBodyDetails) {
  Client.for(chrome.tabs, req.tabId).message("/snapshot/remove");
}
