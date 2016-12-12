/* global sleep:false */
import {ScheduledQueues, Recovery} from "../../Models/Queue/Queue";
import Config from "../../Models/Config";

import NotificationService from "../../Services/NotificationService";
const notifications = new NotificationService();

import WindowService from "../../Services/WindowService";
import CaptureService from "../../Services/CaptureService";
import TrimService from "../../Services/TrimService";
import Rectangle from "../../Services/Rectangle";

import OCR from "../../Services/API/OCR";

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
export function onRecoveryStartCompleted(detail, dock = __dock_id) {

    if (!Config.isNotificationEnabled("recovery")) return;

    const windows = WindowService.getInstance();
    const captures = new CaptureService();
    const ocr = new OCR();
    sleep(0.85)
    .then(() => windows.find(true))
    .then(tab => captures.capture(tab.windowId))
    .then(uri => Image.init(uri))
    .then(img => TrimService.init(img).trim(Rectangle.init(img).ofRecovery(dock)))
    .then(uri => Promise.resolve(uri.replace(/data:image\/[png|jpeg|gif];base64,/, "")))
    .then(uri => ocr.execute(uri))
    .then(({result}) => Promise.resolve(result.split(":").map(n => parseInt(n))))
    .then(([h, m, s]) => Promise.resolve({h, m, s}))
    .then(time => {
        console.log("OCR", time);
        const S = 1000; const M = 60 * S; const H = 60 * M;
        const length = time.h * H + (time.m - 1) * M + time.s * S;
        const recovery = new Recovery(Date.now() + length, dock, time);
        ScheduledQueues.append("recoveries", recovery);
        notifications.create(recovery.toNotificationID(), recovery.toNotificationParamsForStart());
    });
}

export function onRecoveryDocksDisplayed() {
    // TODO: Controllerからchromeを参照するのはやめましょう
    chrome.notifications.getAll(notes => {
        Object.keys(notes).filter(id => { return id.match(/^recovery/); }).map(id => {
            chrome.notifications.clear(id);
        });
    });
}
