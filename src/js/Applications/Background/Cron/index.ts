import NotificationService from "../../../Services/Notification";
import Config from "../../Models/Config";
import Mission from "../../Models/Queue/Mission";
import Recovery from "../../Models/Queue/Recovery";
import Shipbuilding from "../../Models/Queue/Shipbuilding";

export function UpdateQueues() {

  const missions = Mission.scan();
  const recoveries = Recovery.scan();
  const shipbuildings = Shipbuilding.scan();

  const notifications = new NotificationService();
  [...missions.finished, ...recoveries.finished, ...shipbuildings.finished].map(q => {
    const notify = Config.find<Config<boolean>>(`notification-${q.kind().toLowerCase()}`).value;
    if (notify) {
      const nid = q.toNotificationID({finished: true});
      notifications.create(nid, q.notificationOption());
    }
  });

  // const nearest = upcoming.sort((p, n) => p.scheduled < n.scheduled ? -1 : 1)[0];
  // console.log("TODO: これでバッジとかどうにかする", nearest);
}
