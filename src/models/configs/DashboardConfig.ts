import { Model } from "jstorm/chrome/local";

export class DashboardConfig extends Model {
  public static readonly _namespace_ = "DashboardConfig";

  static default = {
    "user": {
      "width": 600,
      "height": 400,
      "left": 100,
      "top": 100,
    },
  };

  public width: number = 600;
  public height: number = 400;
  public left: number = 100;
  public top: number = 100;

  static async user(): Promise<DashboardConfig> {
    return (await this.find("user"))!;
  }

}