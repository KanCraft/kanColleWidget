import { Model } from "jstorm/chrome/local";

export class GameWindowConfig extends Model {
  static override _namespace_ = "GameWindowConfig";
  static override default = {
    "user": {
      alertBeforeClose: true,
      showMuteButton: true,
      showScreenshotButton: true,
      buttonSize: 100,
    },
  }
  public static async user(): Promise<GameWindowConfig> {
    return (await GameWindowConfig.find("user"))!;
  }
  public alertBeforeClose: boolean = true;
  public showMuteButton: boolean = true;
  public showScreenshotButton: boolean = true;
  public buttonSize: number = 100;
}
