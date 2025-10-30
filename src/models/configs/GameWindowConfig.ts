import { Model } from "jstorm/chrome/local";

export class GameWindowConfig extends Model {
  static override _namespace_ = "GameWindowConfig";
  static override default = {
    "user": {
      alertBeforeClose: true,
    },
  }
  public static async user(): Promise<GameWindowConfig> {
    return (await GameWindowConfig.find("user"))!;
  }
  public alertBeforeClose: boolean = true;
}
