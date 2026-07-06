import { Model } from "jstorm/chrome/local";
import { type RelativeRect } from "../services/CropService";

/**
 * 編成キャプチャのプリセット
 * 切り抜き範囲（ゲーム描画領域基準の相対座標）とグリッド構成を名前付きで保持する
 */
export class CapturePreset extends Model {
  public static readonly _namespace_ = "CapturePreset";

  // プリセットの名前
  public name = "";

  // プリセットの説明
  public description = "";

  // 切り抜き範囲。ゲーム描画領域の幅・高さを1とした相対値
  public rect: RelativeRect = { x: 0, y: 0, w: 1, h: 1 };

  // キャプチャを並べるグリッド。各セルの値は画面上の案内ラベル
  public composition: string[][] = [["1-1"]];

  // 削除・上書き禁止フラグ（組み込みプリセット用）
  public protected = false;

  public static override default = {
    __fleet__: {
      name: "通常艦隊",
      description: "通常の最大6隻編成の艦隊に対応したキャプチャです",
      rect: { x: 0.39, y: 0.20, w: 0.60, h: 0.78 },
      composition: [
        ["旗艦", "第二艦"],
        ["第三艦", "第四艦"],
        ["第五艦", "第六艦"],
      ],
      protected: true,
    },
    __combined__: {
      name: "連合艦隊",
      description: "第一艦隊と第二艦隊を横に並べる連合艦隊編成に対応したキャプチャです",
      rect: { x: 0.39, y: 0.20, w: 0.60, h: 0.78 },
      composition: [
        ["第一艦隊 旗艦", "第二艦", "第二艦隊 旗艦", "第二艦"],
        ["第三艦", "第四艦", "第三艦", "第四艦"],
        ["第五艦", "第六艦", "第五艦", "第六艦"],
      ],
      protected: true,
    },
    __aviation__: {
      name: "基地航空隊",
      description: "基地航空隊の最大3部隊編成に対応したキャプチャです",
      rect: { x: 0.723, y: 0.23, w: 0.27, h: 0.73 },
      composition: [
        ["第一航空隊", "第二航空隊", "第三航空隊"],
      ],
      protected: true,
    },
  };
}
