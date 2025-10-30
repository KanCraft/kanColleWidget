import { Model } from "jstorm/chrome/local";

export enum DamageSnapshotMode {
  DISABLED = "disabled",
  INAPP = "inapp",
}

export const DamageSnapshotModeDictionary = {
  [DamageSnapshotMode.DISABLED]: {
    label: "使わない",
  },
  [DamageSnapshotMode.INAPP]: {
    label: "ゲーム窓内で表示",
  },
};

export class DamageSnapshotConfig extends Model {
  static override _namespace_ = "DamageSnapshotConfig";
  static override default = {
    "user": {
      "mode": DamageSnapshotMode.INAPP,
    },
  }
  public mode: DamageSnapshotMode = DamageSnapshotMode.INAPP;

  public static async user(): Promise<DamageSnapshotConfig> {
    return (await DamageSnapshotConfig.find("user"))!;
  }
}