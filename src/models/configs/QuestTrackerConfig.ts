import { Model } from "jstorm/chrome/local";

// 任務トラッカー機能そのものの設定。通知の有効/無効やアイコン・音は
// NotificationConfig の "/quest-alert/start" エントリが別途持つ。
export class QuestTrackerConfig extends Model {
  static override _namespace_ = "QuestTrackerConfig";
  static override default = {
    "user": {
      // ダッシュボードにも一覧を表示するか。既定はfalse（独立タブが既定の導線）
      "showOnDashboard": false,
    },
  };

  public showOnDashboard: boolean = false;

  public static async user(): Promise<QuestTrackerConfig> {
    return (await this.find("user"))!;
  }
}
