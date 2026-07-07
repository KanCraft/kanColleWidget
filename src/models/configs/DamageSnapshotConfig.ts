import { Model } from "jstorm/chrome/local";
import type { AreaLabelFormat } from "../sortieLabel";

export enum DamageSnapshotMode {
  DISABLED = "disabled", // 使わない
  INAPP = "inapp", // ゲーム別窓内表示
  SEPARATE = "separate", // 別窓表示
}

export const DamageSnapshotModeDictionary = {
  [DamageSnapshotMode.DISABLED]: {
    label: "使わない",
  },
  [DamageSnapshotMode.INAPP]: {
    label: "ゲーム窓内で表示",
  },
  [DamageSnapshotMode.SEPARATE]: {
    label: "別窓で表示",
  },
};

// 既定値の単一定義。static default（未保存時のレコード）と
// プロパティ初期値（保存済みレコードに無いフィールドの補完）は必ずここから導出する。
const DEFAULTS = {
  mode: DamageSnapshotMode.INAPP,
  position: { left: 0, top: 0 },
  size: { width: 160, height: 260 },
  heightRatio: 40,
  // 海域名ラベルの表記（番号 "1-1" / 日本語名）。既定は番号。 @see #1764
  areaLabelFormat: "number" as AreaLabelFormat,
  // 次の窓が表示されるまで前の窓を消さない（戦闘開始時の自動消去を抑制）。既定 false。母港帰投では消す。
  keepUntilNextShow: false,
};

export class DamageSnapshotConfig extends Model {
  static override _namespace_ = "DamageSnapshotConfig";
  static override default = {
    "user": {
      ...DEFAULTS,
      position: { ...DEFAULTS.position },
      size: { ...DEFAULTS.size },
    },
  }
  public mode: DamageSnapshotMode = DEFAULTS.mode;
  public position = { ...DEFAULTS.position };
  public size = { ...DEFAULTS.size };
  public heightRatio: number = DEFAULTS.heightRatio;
  public areaLabelFormat: AreaLabelFormat = DEFAULTS.areaLabelFormat;
  public keepUntilNextShow: boolean = DEFAULTS.keepUntilNextShow;

  public static async user(): Promise<DamageSnapshotConfig> {
    return (await DamageSnapshotConfig.find("user"))!;
  }
}