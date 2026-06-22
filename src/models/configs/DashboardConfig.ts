import { Model } from "jstorm/chrome/local";

export class DashboardConfig extends Model {
  public static readonly _namespace_ = "DashboardConfig";

  static default = {
    "user": {
      "width": 320,
      "height": 220,
      "left": 10,
      "top": 10,
      // ゲーム窓を新規に開いたとき、ダッシュボードも同時に開くか（#1216）。既定は false（従来どおり手動）。
      "openWithGame": false,
    },
  };

  public width: number = 320;
  public height: number = 220;
  public left: number = 100;
  public top: number = 100;
  public openWithGame: boolean = false;

  static async user(): Promise<DashboardConfig> {
    return (await this.find("user"))!;
  }

  /**
   * ゲーム窓の起動に合わせてダッシュボードを自動で開くべきかを判定する（#1216）。
   * 設定 ON かつ「新規作成時のみ」が条件。既存ゲーム窓の再フォーカスでは開かない。
   * @param gameWindowCreated launch でゲーム窓を新規作成したか（既存窓の再フォーカスは false）
   */
  public shouldOpenOnLaunch(gameWindowCreated: boolean): boolean {
    return gameWindowCreated && this.openWithGame;
  }

  public toWindowCreateData(): chrome.windows.CreateData {
    return {
      width: this.width,
      height: this.height,
      left: this.left,
      top: this.top,
    };
  }
}
