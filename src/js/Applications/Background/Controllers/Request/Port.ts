import { Client } from "chomex/lib/Client";
import WindowService from "../../../../Services/Window";
import Sortie from "../../../Models/Sortie";

export async function OnPort(req: chrome.webRequest.WebRequestBodyDetails) {

  Sortie.context().refresh();

  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/remove");
  WindowService.getInstance().cleanDamageSnapshot();
  return {status: 200};
}
