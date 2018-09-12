import { Client } from "chomex/lib/Client";

export async function OnPort(req: chrome.webRequest.WebRequestBodyDetails) {
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/remove");
}

export async function OnBattleStarted(req: chrome.webRequest.WebRequestBodyDetails) {
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/remove");
}
