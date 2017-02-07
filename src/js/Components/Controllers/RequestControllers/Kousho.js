/* global sleep:false */
/**
 * 工廠のAPIが叩かれようとするときに発動するやつ
 */
import WindowService       from "../../Services/WindowService";
import CaptureService      from "../../Services/CaptureService";
import TrimService         from "../../Services/TrimService";
import Rectangle           from "../../Services/Rectangle";
import OCR                 from "../../Services/API/OCR";
import NotificationService from "../../Services/NotificationService";

import {ScheduledQueues,CreateShip} from "../../Models/Queue/Queue";
import Config from "../../Models/Config";
import {CREATESHIP} from "../../../Constants";

var __dock_id = 1;

export function onCreateShipStart(detail) {
    const {requestBody:{formData:{api_kdock_id:[dock_id],api_highspeed}}} = detail;
    __dock_id = parseInt(dock_id);
    if (api_highspeed == 1) __dock_id = null;
}

/**
 * 建造のやつ
 */
export function onCreateShipCompleted(detail, dock = __dock_id) {

    if (__dock_id == null) return;
    if (!Config.isNotificationEnabled(CREATESHIP)) return;

    const windows = WindowService.getInstance();
    const captures = new CaptureService();
    const ocr = new OCR();
    const notifications = new NotificationService();
    return sleep(0.85)
    .then(() => windows.find(true))
    .then(tab => captures.capture(tab.windowId))
    .then(uri => Image.init(uri))
    .then(img => TrimService.init(img).trim(Rectangle.init(img).ofCreateShip(dock)))
    .then(uri => Promise.resolve(uri.replace(/data:image\/[png|jpeg|gif];base64,/, "")))
    .then(uri => ocr.execute(uri))
    .then(({result}) => Promise.resolve(result.split(":").map(n => parseInt(n))))
    .then(([h, m, s]) => Promise.resolve({h, m, s}))
    .then(time => {
        const S = 1000; const M = 60 * S; const H = 60 * M;
        const length = time.h * H + time.m * M + time.s * S;
        const createship = new CreateShip(Date.now() + length, dock, time);
        ScheduledQueues.append(CREATESHIP, createship);
        if (Config.find("notification-display").onstart) notifications.create(createship.toNotificationID(), createship.toNotificationParamsForStart());
        return Promise.resolve(time);
    });
}

export function onCreateShipSpeedup(detail) {
    const {requestBody:{formData:{api_kdock_id:[dock_id]}}} = detail;
    // FIXME: 表記ゆれの名残。いずれ消す
    let createships = ScheduledQueues.find(CREATESHIP) || ScheduledQueues.find("createships");
    createships.clear(dock_id);
}

export function onGetShip(/* detail */) {
    // TODO: Controllerからchromeを参照するのはやめましょう
    chrome.notifications.getAll(notes => {
        Object.keys(notes).filter(id => { return id.match(/^createship/); }).map(id => {
            chrome.notifications.clear(id);
        });
    });
}
