/* global sleep:false */
import ImageRecognizationService from "../../Services/ImageRecognizationService";
import {ScheduledQueues, Recovery} from "../../Models/Queue/Queue";

import NotificationService from "../../Services/NotificationService";
const notifications = new NotificationService();

var __dock_id = null;

/**
 * 修復開始リクエスト完了トリガーには修復ドックの番号が含まれていない.
 * したがって修復開始リクエストの時点で修復ドックの番号をどこか（オンメモリでええやろ）に
 * 保存したうえで、修復開始リクエスト完了トリガー時にそれを使用する必要がある.
 */
export function onRecoveryStart(detail) {
    const {requestBody:{formData:{api_ndock_id:[dock_id]}}} = detail;
    __dock_id = parseInt(dock_id);
}

/**
 * 上記の通り、このコントローラーが発火するときのdetailには修復ドックの番号が含まれていない.
 * したがって、上記のコントローラが保存したドック番号を参照している.
 */
export function onRecoveryStartCompleted(/* detail */) {
    const irs = new ImageRecognizationService("recovery", __dock_id);
    sleep(0.85)
    .then(irs.test.bind(irs))
    .then(time => {
        console.log(time);
        const hours = time.hours * (60 * 60 * 1000);
        const minutes = time.minutes * (60 * 1000);
        const recovery = new Recovery(Date.now() + hours + minutes - (1 * 60 * 1000), __dock_id, time);
        ScheduledQueues.append("recoveries", recovery);
        notifications.create(recovery.toNotificationID(), recovery.toNotificationParamsForStart());
    });
}
