import NotificationService from "../../../Services/Notification";
import Mission from "../../Models/Queue/Mission";
import Recovery from "../../Models/Queue/Recovery";
import Shipbuilding from "../../Models/Queue/Shipbuilding";
import Tiredness from "../../Models/Queue/Tiredness";
import { Kind } from "../../Models/Queue/Queue";
import NotificationSetting from "../../Models/Settings/NotificationSetting";
import SoundService from "../../../Services/Sound";

async function showNotifications(finished: (Mission | Recovery | Shipbuilding | Tiredness)[]) {
  const service = new NotificationService();
  const settings: { [kind: string]: NotificationSetting } = {
    [Kind.Mission]: NotificationSetting.find(Kind.Mission),
    [Kind.Recovery]: NotificationSetting.find(Kind.Recovery),
    [Kind.Shipbuilding]: NotificationSetting.find(Kind.Shipbuilding),
    [Kind.Tiredness]: NotificationSetting.find(Kind.Tiredness),
  };
  return await finished.map(q => {
    const setting = settings[q.kind()];
    const sound = setting.getSound();
    if (sound) new SoundService(sound.url, sound.volume).play();
    if (setting.enabled) return service.create(q.toNotificationID(), setting.getChromeOptions(q));
  });
}

export async function UpdateQueues() {

  const missions = Mission.scan();
  const recoveries = Recovery.scan();
  const shipbuildings = Shipbuilding.scan();
  const tiredness = Tiredness.scan();

  const finished = [
    ...missions.finished,
    ...recoveries.finished,
    ...shipbuildings.finished,
    ...tiredness.finished,
  ];
  await showNotifications(finished);

  // const nearest = upcoming.sort((p, n) => p.scheduled < n.scheduled ? -1 : 1)[0];
  // console.log("TODO: これでバッジとかどうにかする", nearest);
}
