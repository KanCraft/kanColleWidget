import {ScheduledQueues, Mission, Recovery, CreateShip} from "../../Models/Queue/Queue";

const M = 60 * 1000, H = 60 * M;

export function GetQueues(/* message */) {
    return ScheduledQueues.all();
}

export function SetQueueManual({queue, time}) {
    let t = Date.now() + time.h * H + time.m * M;
    let q = (() => {
        switch (queue.type) {
        case "missions":    return new Mission(t, "<manual>", queue.identifier, 0);
        case "recoveries":  return new Recovery(t, queue.identifier, t);
        case "createships": return new CreateShip(t, queue.identifier, t);
        default: false;
        }
    })();
    if (!q) return Promise.reject({status: 400});
    ScheduledQueues.append(queue.type, q);
    return Promise.resolve({status: 200, queue: q});
}
