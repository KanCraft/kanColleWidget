import { Model } from "jstorm/chrome/local";

export class GameWindowConfig extends Model {
  static override _namespace_ = "GameWindowConfig";
  static override default = {
    "user": {
      alertBeforeClose: true,
      showMuteButton: true,
      showScreenshotButton: true,
      // 既定は小(4vw)。Issue #1763「ボタンを縮小」に沿い、ORIGINAL 窓(1200px)では現行の 48px と同等の見た目。
      buttonSize: 50,
    },
  }
  public static async user(): Promise<GameWindowConfig> {
    return (await GameWindowConfig.find("user"))!;
  }
  public alertBeforeClose: boolean = true;
  public showMuteButton: boolean = true;
  public showScreenshotButton: boolean = true;
  public buttonSize: number = 50;
}
