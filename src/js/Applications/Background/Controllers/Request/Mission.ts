import NotificationService from "../../../../Services/Notification";
import Config from "../../../Models/Config";
import Mission from "../../../Models/Queue/Mission";

export async function OnMissionStart(req: chrome.webRequest.WebRequestBodyDetails) {
  const { formData: { api_mission_id: [mid], api_deck_id: [did] } } = req.requestBody;
  const mission = Mission.for(mid, did);
  if (!mission) {
    return { status: 404 };
  }
  mission.register();

  const notify = Config.find<Config<boolean>>("notification-mission").value;
  if (notify) {
    const notifications = new NotificationService();
    const nid = mission.toNotificationID({ start: Date.now() });
    notifications.create(nid, mission.notificationOptionOnRegister());
  }
  return { status: 202, mission };
}

export async function OnMissionResult(req: chrome.webRequest.WebRequestBodyDetails) {
  const service = new NotificationService();
  const notes = await service.getAll();
  Object.entries(notes).map(async ([nid]) => {
    if (nid.startsWith(Mission.__ns)) await service.clear(nid);
  });
}