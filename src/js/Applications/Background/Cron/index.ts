import NotificationService from "../../../Services/Notification";
import Mission from "../../Models/Queue/Mission";
import Queue from "../../Models/Queue/Queue";
import Recovery from "../../Models/Queue/Recovery";

export function UpdateQueues() {

  const ns = new NotificationService();
  const finished: Queue[] = [];

  const missions = Mission.scan();
  finished.push(...missions.finished);

  const recoveries = Recovery.scan();
  finished.push(...recoveries.finished);

  finished.map(q => {
    const p = new URLSearchParams({id: q._id});
    ns.create(q._ns + "?" + p.toString(), q.notificationOption());
  });
}
