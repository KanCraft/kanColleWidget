import { Client } from "chomex/lib/Client";
import WindowService from "../../../../Services/Window";
import Mission from "../../../Models/Queue/Mission";

export async function OnPort(req: chrome.webRequest.WebRequestBodyDetails) {
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/remove");
  WindowService.getInstance().cleanDamageSnapshot();
}

export async function OnBattleStarted(req: chrome.webRequest.WebRequestBodyDetails) {
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/remove");
  WindowService.getInstance().cleanDamageSnapshot();
}

export async function OnAirBattleStarted(req: chrome.webRequest.WebRequestBodyDetails) {
  Client.for(chrome.tabs, req.tabId, false).message("/snapshot/remove");
  WindowService.getInstance().cleanDamageSnapshot();
}

export async function OnMissionStart(req: chrome.webRequest.WebRequestBodyDetails) {
  const { formData: { api_deck_id: [did], api_mission_id: [mid] } } = req.requestBody;
  const mission = Mission.for(mid);
  if (!mission) {
    return;
  }
  mission.deck = did;
  mission.register();
}
