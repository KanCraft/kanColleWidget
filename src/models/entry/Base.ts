
export class NotificationEntryBase {
  public static type: string;
  public toNotificationID(): string {
    throw new Error("必ずoverrideして使ってください");
  }
  public toNotificationOptions(): chrome.notifications.NotificationOptions<true> {
    throw new Error("必ずoverrideして使ってください");
    return {
      type: "basic",
      iconUrl: "icons/128.png",
      title: "UNKNOWN",
      message: "UNKNOWN",
    }
  }
}
