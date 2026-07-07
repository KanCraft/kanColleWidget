import { UserConfig } from "./UserConfig";

// エクスポート画像で空白セルを塗る際の透明指定値
export const TransparentBackground = "transparent";

// 既定値の単一定義。static default（未保存時のレコード）と
// プロパティ初期値（保存済みレコードに無いフィールドの補完）は必ずここから導出する。
const DEFAULTS = {
  background: "#ffffff",
};

/**
 * 編成キャプチャの設定
 */
export class FleetCaptureConfig extends UserConfig {
  static override readonly _namespace_ = "FleetCaptureConfig";

  static override default = {
    "user": { ...DEFAULTS },
  };

  // エクスポート画像の下地色（CSSカラー）
  // TransparentBackground のときは塗らない（png保存時のみ透明が有効。jpegでは黒になる）
  public background: string = DEFAULTS.background;
}
