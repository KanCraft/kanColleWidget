
export class NotificationEntryBase {
  public readonly type: string = "unknown";

  // $n は通知の設定のためのプロパティ
  public $n = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id(...args: any[]): string {
      throw new Error(`必ずoverrideして使ってください: ${args}`);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options(...args: any[]): chrome.notifications.NotificationOptions<true> {
      throw new Error(`必ずoverrideして使ってください: ${args}`);
    },
  }
}
