import { Model } from "jstorm/chrome/local";

export class DashboardConfig extends Model {
  public static readonly _namespace_ = "DashboardConfig";

  static default = {
    "user": {
      "width": 320,
      "height": 220,
      "left": 10,
      "top": 10,
    },
  };

  public width: number = 320;
  public height: number = 220;
  public left: number = 100;
  public top: number = 100;

  static async user(): Promise<DashboardConfig> {
    return (await this.find("user"))!;
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
