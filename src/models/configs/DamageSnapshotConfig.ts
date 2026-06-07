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

export class DamageSnapshotConfig extends Model {
  static override _namespace_ = "DamageSnapshotConfig";
  static override default = {
    "user": {
      "mode": DamageSnapshotMode.INAPP,
      "position": { left: 0, top: 0 },
      "size": { width: 160, height: 260 },
      "heightRatio": 40,
      "areaLabelFormat": "number" as AreaLabelFormat,
    },
  }
  public mode: DamageSnapshotMode = DamageSnapshotMode.INAPP;
  public position = { left: 0, top: 0 };
  public size = { width: 160, height: 260};
  public heightRatio: number = 40;
  // 海域名ラベルの表記（番号 "1-1" / 日本語名）。既定は番号。 @see #1764
  public areaLabelFormat: AreaLabelFormat = "number";

  public static async user(): Promise<DamageSnapshotConfig> {
    return (await DamageSnapshotConfig.find("user"))!;
  }
}