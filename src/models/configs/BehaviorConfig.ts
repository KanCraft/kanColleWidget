import { Model } from "jstorm/chrome/local";

// 細かい挙動設定。独立したセクションを設けるほどではない挙動のトグルをまとめて持つ。
export class BehaviorConfig extends Model {
  static override _namespace_ = "BehaviorConfig";

  static override default = {
    "user": {
      // 出撃時に同じ艦隊の疲労タイマー（FATIGUE の Queue）を削除して積み直すか。
      // 既定 false（出撃ごとにタイマーが並ぶ。連続出撃の回数把握に使える）。
      "restackFatigueOnSortie": false,
    },
  };

  public restackFatigueOnSortie: boolean = false;

  public static async user(): Promise<BehaviorConfig> {
    return (await this.find("user"))!;
  }
}
