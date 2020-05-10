import NotificationService from "../../../Services/Notification";
import Config from "../../Models/Config";
import Mission from "../../Models/Queue/Mission";
import Queue from "../../Models/Queue/Queue";
import Recovery from "../../Models/Queue/Recovery";
import Shipbuilding from "../../Models/Queue/Shipbuilding";

export function UpdateQueues() {

    const missions = Mission.scan();
    const recoveries = Recovery.scan();
    const shipbuildings = Shipbuilding.scan();

    const finished: Queue[] = [].concat(missions.finished, recoveries.finished, shipbuildings.finished);
    // const upcoming: Queue[] = [].concat(missions.upcomming, recoveries.upcomming, shipbuildings.upcomming);

    const ns = new NotificationService();

    finished.map(q => {
        const p = new URLSearchParams({id: q._id});
        console.log("NS?", q._ns());
        const notify = Config.find<Config<boolean>>(`notification-${q._ns().toLowerCase()}`).value;
        if (notify) {
            ns.create(`${q._ns()}?${p.toString()}`, q.notificationOption());
        }
    });

    // const nearest = upcoming.sort((p, n) => p.scheduled < n.scheduled ? -1 : 1)[0];
    // console.log("TODO: これでバッジとかどうにかする", nearest);
}
