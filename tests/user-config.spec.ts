import { expect, describe, it } from "vitest";

import { BehaviorConfig } from "../src/models/configs/BehaviorConfig";
import { DamageSnapshotConfig } from "../src/models/configs/DamageSnapshotConfig";
import { DashboardConfig } from "../src/models/configs/DashboardConfig";
import { FileSaveConfig } from "../src/models/configs/FileSaveConfig";
import { FleetCaptureConfig } from "../src/models/configs/FleetCaptureConfig";
import { GameWindowConfig } from "../src/models/configs/GameWindowConfig";
import { QuestTrackerConfig } from "../src/models/configs/QuestTrackerConfig";
import { UserConfig } from "../src/models/configs/UserConfig";

// UserConfig を継承する7クラスが、共通基底の static user() をそのまま使えることを検証する。
// 各クラス固有の設定項目・移行ロジックは個別 spec（behavior-config.spec.ts 等）が担当する。
const derivedConfigs = [
  BehaviorConfig,
  DamageSnapshotConfig,
  DashboardConfig,
  FileSaveConfig,
  FleetCaptureConfig,
  GameWindowConfig,
  QuestTrackerConfig,
] as const;

describe("UserConfig 派生クラス", () => {
  it.each(derivedConfigs.map((config) => [config.name, config] as const))(
    "%s の static default はキー user の初期値を持つ",
    (_name, config) => {
      expect(config.default.user).toBeTypeOf("object");
      expect(config.default.user).not.toBeNull();
    },
  );

  it.each(derivedConfigs.map((config) => [config.name, config] as const))(
    "%s.user() は既定値の入ったインスタンスを返す",
    async (_name, config) => {
      const instance = await config.user();
      expect(instance).toMatchObject(config.default.user);
    },
  );
});

describe("UserConfig.user() と migrate() の配線", () => {
  // user() は取得したインスタンスに対して migrate() を呼び、その戻り値をそのまま返す
  // （テンプレートメソッドの配線）ことを、テスト内で定義した派生クラスで検証する。
  it("migrate() を override すると、その戻り値が user() の結果になる", async () => {
    class MigratingConfig extends UserConfig {
      static override readonly _namespace_ = "MigratingConfig";
      static override default = {
        "user": { migrated: false },
      };

      public migrated: boolean = false;

      protected override async migrate(): Promise<MigratingConfig> {
        return await this.update({ migrated: true });
      }
    }

    const config = await MigratingConfig.user();
    expect(config.migrated).toBe(true);
  });

  it("migrate() を override しなければ、取得したインスタンスがそのまま返る", async () => {
    class PlainConfig extends UserConfig {
      static override readonly _namespace_ = "PlainConfig";
      static override default = {
        "user": { value: 1 },
      };

      public value: number = 1;
    }

    const config = await PlainConfig.user();
    expect(config.value).toBe(1);
  });
});
