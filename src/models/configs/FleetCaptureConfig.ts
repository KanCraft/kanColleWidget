import { Model } from "jstorm/chrome/local";

// エクスポート画像で空白セルを塗る際の透明指定値
export const TransparentBackground = "transparent";

/**
 * 編成キャプチャの設定
 */
export class FleetCaptureConfig extends Model {
  public static readonly _namespace_ = "FleetCaptureConfig";

  static default = {
    "user": {
      background: "#ffffff",
    },
  };

  // エクスポート画像の下地色（CSSカラー）
  // TransparentBackground のときは塗らない（png保存時のみ透明が有効。jpegでは黒になる）
  public background: string = "#ffffff";

  static async user(): Promise<FleetCaptureConfig> {
    return (await this.find("user"))!;
  }
}
