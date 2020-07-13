import NotificationService from "../../../../Services/Notification";
import Mission from "../../../Models/Queue/Mission";
import NotificationSetting from "../../../Models/Settings/NotificationSetting";
import { DebuggableRequest } from "../../../../definitions/debuggable";

export async function OnMissionStart(req: chrome.webRequest.WebRequestBodyDetails) {
  const { formData: { api_mission_id: [mid], api_deck_id: [did] } } = req.requestBody;
  const mission = Mission.for(mid, did);
  if (!mission) {
    return { status: 404 };
  }
  mission.register();

  const setting = NotificationSetting.find<NotificationSetting>(mission.kind());
  if (!setting.enabled) return { status: 202, mission };

  const notifications = new NotificationService();
  const nid = mission.toNotificationID({ start: Date.now() });
  await notifications.create(nid, setting.getChromeOptions(mission, false));

  return { status: 202, mission };
}

/**
 * @MESSAGE /api_req_mission/return_instruction
 * 遠征途中で中断帰投させたときの処理
 */
export async function OnMissionInterruption(req: DebuggableRequest) {
  const { formData: { api_deck_id: [did]} } = req.requestBody;
  return Mission.filter<Mission>(r => r.deck == did).map(r => r.delete());
}

export async function OnMissionResult() {
  const service = new NotificationService();
  const notes = await service.getAll();
  Object.entries(notes).map(async ([nid]) => {
    if (nid.startsWith(Mission.__ns)) await service.clear(nid);
  });
}