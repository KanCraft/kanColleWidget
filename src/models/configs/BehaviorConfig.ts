import { Model } from "jstorm/chrome/local";

// タイマー監視間隔（秒）の選択肢
export const QueueWatchIntervalOptions = [5, 10, 20, 30] as const;
export type QueueWatchIntervalSeconds = (typeof QueueWatchIntervalOptions)[number];

const DEFAULT_QUEUE_WATCH_INTERVAL_SECONDS: QueueWatchIntervalSeconds = 30;

// 出撃記録（Logbook）の既定保存期間（日数）。未設定(null)時に自動確定する値。
const DEFAULT_LOGBOOK_RETENTION_DAYS = 7;

// 細かい挙動設定。独立したセクションを設けるほどではない挙動の設定をまとめて持つ。
export class BehaviorConfig extends Model {
  static override _namespace_ = "BehaviorConfig";

  // /cron/queues アラームの周期（秒）。chrome.alarms の periodInMinutes 下限 0.5 に相当する。
  public static readonly ALARM_PERIOD_SECONDS = 30;

  public static readonly DEFAULT_LOGBOOK_RETENTION_DAYS = DEFAULT_LOGBOOK_RETENTION_DAYS;

  static override default = {
    "user": {
      // 出撃時に同じ艦隊の疲労タイマー（FATIGUE の Queue）を削除して積み直すか。
      // 既定 false（出撃ごとにタイマーが並ぶ。連続出撃の回数把握に使える）。
      "restackFatigueOnSortie": false,
      // Queue の期限を確認する間隔（秒）。短いほど予定時刻に近いタイミングで通知される。
      "queueWatchIntervalSeconds": DEFAULT_QUEUE_WATCH_INTERVAL_SECONDS,
      // 出撃記録（Logbook）の保存期間（日数）。0は無期限。null は未設定を表し、
      // Logbook.record() が初回に既存記録の有無を見て自動確定する（Logbook.ts 参照）。
      "logbookRetentionDays": null as number | null,
    },
  };

  public restackFatigueOnSortie: boolean = false;
  public queueWatchIntervalSeconds: number = DEFAULT_QUEUE_WATCH_INTERVAL_SECONDS;
  public logbookRetentionDays: number | null = null;

  public static async user(): Promise<BehaviorConfig> {
    return (await this.find("user"))!;
  }

  /**
   * タイマー監視間隔（秒）を選択肢のいずれかに正規化して返す。
   * 保存値が選択肢にない場合は既定の30秒として扱う。
   */
  public normalizedQueueWatchIntervalSeconds(): QueueWatchIntervalSeconds {
    const found = QueueWatchIntervalOptions.find((v) => v === this.queueWatchIntervalSeconds);
    return found ?? DEFAULT_QUEUE_WATCH_INTERVAL_SECONDS;
  }
}
