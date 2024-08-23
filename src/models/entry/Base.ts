
export default class QueueEntryBase {
  public static type: string;
  public scheduled: number = 0; // 予定時刻 (Epoch Time) [ms]
}