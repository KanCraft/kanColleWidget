/* global process:false */

import Config from "../../Models/Config";

import {MISSION,RECOVERY,CREATESHIP,TIREDNESS} from "../../../Constants";

import Assets              from "../../../Services/Assets";
import NotificationService from "../../../Services/NotificationService";

export function NotificationDebug(params) {
  const notifications = new NotificationService();
  const assets = new Assets(Config);
  switch (params.name) {
  case "notification-for-default":
    assets.playSoundIfSet("default");
    return notifications.create(`debug.${Date.now()}`, {
      type: "basic",
      title: "[TEST]",
      message: "default",
      requireInteraction: false,
      iconUrl: assets.getNotificationIcon("default"),
    });
  case "notification-for-mission":
    assets.playSoundIfSet(MISSION);
    return notifications.create(`debug.${Date.now()}`, {
      type: "basic",
      title: "[TEST] 遠征通知テスト",
      message: "遠征帰投",
      requireInteraction: false,
      iconUrl: assets.getNotificationIcon(MISSION),
    });
  case "notification-for-recovery":
    assets.playSoundIfSet(RECOVERY);
    return notifications.create(`debug.${Date.now()}`, {
      type: "basic",
      title: "[TEST] 修復通知テスト",
      message: "修復完了",
      requireInteraction: false,
      iconUrl: assets.getNotificationIcon(RECOVERY),
    });
  case "notification-for-createship":
    assets.playSoundIfSet(CREATESHIP);
    return notifications.create(`debug.${Date.now()}`, {
      type: "basic",
      title: "[TEST] 建造通知テスト",
      message: "建造完了",
      requireInteraction: false,
      iconUrl: assets.getNotificationIcon(CREATESHIP),
    });
  case "notification-for-tiredness":
    assets.playSoundIfSet(TIREDNESS);
    return notifications.create(`debug.${Date.now()}`, {
      type: "basic",
      title: "[TEST] 疲労回復通知テスト",
      message: "疲労回復",
      requireInteraction: false,
      iconUrl: assets.getNotificationIcon(TIREDNESS),
    });
  default:
    console.log(params);
  }
}

if (process.env.NODE_ENV != "production") {
  var ConfigControllers = require("./Config");
  var registry = {
    "message": {
      ...ConfigControllers,
    },
    "request": {
      ...require("../RequestControllers/Port"),
      ...require("../RequestControllers/Deck"),
    }
  };
  module.exports.ExecuteController = ({kind, controller, params}) => {
    const request = {kind, controller, params};
    if (!registry[kind]) return Promise.reject({
      status: 400, request, error: `No controller for kind "${kind}" found"`
    });
    if (typeof registry[kind][controller] != "function") return Promise.reject({
      status: 400, request, error: `No controller for name "${controller}" found`
    });
    const response = registry[kind][controller].call(params.__this, params);
    if (response instanceof Promise) {
      return response.then(res => Promise.resolve({status: 200, request, response: res}))
            .catch(res => Promise.resolve({status: 200, request, response: res}));
    } else {
      return Promise.resolve({status: 200, request,response});
    }
  };
}
