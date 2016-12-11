import {onRecoveryStartCompleted} from "../RequestControllers/Recovery";
import {onCreateShipCompleted}    from "../RequestControllers/Kousho";
import NotificationService        from "../../Services/NotificationService";

import Config from "../../Models/Config";
import Assets from "../../Services/Assets";

export function ImageRecognizationDebug(params) {
    switch (params.purpose) {
    case "createship":
        return onCreateShipCompleted({}, params.index);
    case "recovery":
    default:
        return onRecoveryStartCompleted({}, params.index);
    }
}

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
        assets.playSoundIfSet("mission");
        return notifications.create(`debug.${Date.now()}`, {
            type: "basic",
            title: "[TEST] 遠征通知テスト",
            message: "遠征帰投",
            requireInteraction: false,
            iconUrl: assets.getNotificationIcon("mission"),
        });
    case "notification-for-recovery":
        assets.playSoundIfSet("recovery");
        return notifications.create(`debug.${Date.now()}`, {
            type: "basic",
            title: "[TEST] 修復通知テスト",
            message: "修復完了",
            requireInteraction: false,
            iconUrl: assets.getNotificationIcon("recovery"),
        });
    case "notification-for-createship":
        assets.playSoundIfSet("createship");
        return notifications.create(`debug.${Date.now()}`, {
            type: "basic",
            title: "[TEST] 建造通知テスト",
            message: "建造完了",
            requireInteraction: false,
            iconUrl: assets.getNotificationIcon("createship"),
        });
    case "notification-for-tiredness":
        assets.playSoundIfSet("tiredness");
        return notifications.create(`debug.${Date.now()}`, {
            type: "basic",
            title: "[TEST] 疲労回復通知テスト",
            message: "疲労回復",
            requireInteraction: false,
            iconUrl: assets.getNotificationIcon("tiredness"),
        });
    default:
        console.log(params);
    }
}
