import { Client } from "chomex/lib/Client";
import WindowService from "../../../../Services/Window";

export async function OnPort(req: chrome.webRequest.WebRequestBodyDetails) {
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/remove");
  WindowService.getInstance().cleanDamageSnapshot();
  return {status: 200};
}
