import Queue, { Scanned } from "./Queue";

export default class Shipbuilding extends Queue {

    static scan(): Scanned<Shipbuilding> {
        return super._scan<Shipbuilding>(Shipbuilding, Date.now());
    }

    dock: number | string;
    time: number;
    text: string;

    register(scheduled: number): Shipbuilding {
        return super._register<Shipbuilding>(scheduled);
    }

    notificationOption(): chrome.notifications.NotificationOptions {
        return {
            iconUrl: this.defaultIconURL,
            message: `間もなく、第${this.dock}ドックの建造が完了します`,
            requireInteraction: true,
            title: "建造完了",
            type: "basic",
        };
    }

}
