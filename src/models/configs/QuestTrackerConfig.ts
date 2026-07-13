import { UserConfig } from "./UserConfig";

// 既定値の単一定義。static default（未保存時のレコード）と
// プロパティ初期値（保存済みレコードに無いフィールドの補完）は必ずここから導出する。
const DEFAULTS = {
  // ダッシュボードにも一覧を表示するか。既定はfalse（独立タブが既定の導線）
  showOnDashboard: false,
};

// 任務トラッカー機能そのものの設定。通知の有効/無効やアイコン・音は
// NotificationConfig の "/quest-alert/start" エントリが別途持つ。
export class QuestTrackerConfig extends UserConfig {
  static override readonly _namespace_ = "QuestTrackerConfig";
  static override default = {
    "user": { ...DEFAULTS },
  };

  public showOnDashboard: boolean = DEFAULTS.showOnDashboard;
}
