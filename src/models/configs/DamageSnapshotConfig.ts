import { Model } from "jstorm/chrome/local";

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
    },
  }
  public mode: DamageSnapshotMode = DamageSnapshotMode.INAPP;
  public position = { left: 0, top: 0 };
  public size = { width: 160, height: 260};
  public heightRatio: number = 40;

  public static async user(): Promise<DamageSnapshotConfig> {
    return (await DamageSnapshotConfig.find("user"))!;
  }
}