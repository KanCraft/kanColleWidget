import {ScheduledQueues, Mission, Recovery, CreateShip} from "../../Models/Queue/Queue";
import {MISSION, RECOVERY, CREATESHIP} from "../../../Constants";

const M = 60 * 1000, H = 60 * M;

export function GetQueues(/* message */) {
    return ScheduledQueues.all();
}

export function SetQueueManual({queue, time}) {
    const type = queue.type || queue.params.type;
    let t = Date.now() + time.h * H + time.m * M;
    let q = (() => {
        switch (type) {
        case "missions":    // FIXME: 表記ゆれの名残で、ちょっと存命させる。将来的に消す行
        case MISSION:    return new Mission(t, "<manual>", queue.identifier, 0);
        case "recoveries":  // FIXME: 表記ゆれの名残で、ちょっと存命させる。将来的に消す行
        case RECOVERY:   return new Recovery(t, queue.identifier, t);
        case "createships": // FIXME: 表記ゆれの名残で、ちょっと存命させる。将来的に消す行
        case CREATESHIP: return new CreateShip(t, queue.identifier, t);
        default: false;
        }
    })();
    if (!q) return Promise.reject({status: 400});
    ScheduledQueues.append(type, q);
    return Promise.resolve({status: 200, queue: q});
}
