import { Client } from "chomex/lib/Client";
import WindowService from "../../../../Services/Window";
import Mission from "../../../Models/Queue/Mission";

export async function OnMissionStart(req: chrome.webRequest.WebRequestBodyDetails) {
  const { formData: { api_mission_id: [mid], api_deck_id: [did] } } = req.requestBody;
  const mission = Mission.for(mid, did);
  if (!mission) {
    return;
  }
  mission.register();
}
