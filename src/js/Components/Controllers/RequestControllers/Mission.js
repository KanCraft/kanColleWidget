/**
 * 遠征関係のAPIリクエストが飛んだ時に発火するコントローラ群
 */

 // Utilities
// import {Logger} from "chomex";
// const logger = new Logger();

// Dependencies
import {Mission, ScheduledQueues} from "../../Models/Queue/Queue";
import NotificationService from "../../Services/NotificationService";
const notifications = new NotificationService();

/**
 * onMissionStart
 * 遠征に向かわせたときに発火するやつ
 */
export function onMissionStart(detail) {
    const data = detail.requestBody.formData;
    const mission = Mission.createFromFormData(data);
    ScheduledQueues.append("missions", mission);
  // FIXME: ParamsをMissionモデルに考えさせるより、もっとControllerをファットにすべきなんじゃないか？
    notifications.create(mission.toNotificationID(), mission.toNotificationParamsForStart());
}

export function onMissionResult(/* detail */) {
  // とりあえず
    chrome.notifications.getAll(notes => {
        Object.keys(notes).filter(id => { return id.match(/mission/); }).map(id => {
            chrome.notifications.clear(id);
        });
    });
}
