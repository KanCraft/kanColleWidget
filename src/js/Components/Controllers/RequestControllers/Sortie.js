import Config from "../../Models/Config";
import {ScheduledQueues, Tiredness} from "../../Models/Queue/Queue";

export function onSortieStart(detail) {

    if (!Config.isNotificationEnabled("tiredness")) return;

    const {requestBody:{formData:{api_deck_id:[deck]}}} = detail;
    const time = Date.now() + Config.find("notification-for-tiredness").time * (1000 * 60);
    const tiredness = new Tiredness(time, parseInt(deck));

    ScheduledQueues.append("tiredness", tiredness);
}
