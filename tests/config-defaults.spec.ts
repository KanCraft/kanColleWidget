import { expect, describe, it, vi } from "vitest";

// NotificationConfig は static default の初期化で chrome.runtime.getURL を参照するため、
// import より前にスタブする（model-namespace.spec.ts と同じ手当て）
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", getURL: (path: string) => `chrome-extension://test/${path}` },
  };
});

import { DashboardConfig } from "../src/models/configs/DashboardConfig";
import { GameWindowConfig } from "../src/models/configs/GameWindowConfig";
import { DamageSnapshotConfig } from "../src/models/configs/DamageSnapshotConfig";
import { FleetCaptureConfig } from "../src/models/configs/FleetCaptureConfig";
import { BehaviorConfig } from "../src/models/configs/BehaviorConfig";
import { FileSaveConfig } from "../src/models/configs/FileSaveConfig";
import { QuestTrackerConfig } from "../src/models/configs/QuestTrackerConfig";
import { NotificationConfig } from "../src/models/configs/NotificationConfig";

// jstorm の Model.find(id) は storage にレコードが無ければ static default[id] を、
// レコードはあるがフィールドが無ければプロパティ初期値を既定として使う。
// つまり static default は未保存ユーザーの既定、プロパティ初期値は旧ビルドで保存された
// レコードに無いフィールドの既定であり、食い違うとユーザーの状態によって異なる既定値が
// 適用される。ここでは全 Config について両者の一致を機械検証する。
const configs = [
  DashboardConfig,
  GameWindowConfig,
  DamageSnapshotConfig,
  FleetCaptureConfig,
  BehaviorConfig,
  FileSaveConfig,
  QuestTrackerConfig,
] as const;

describe("Config の static default とプロパティ初期値の一致", () => {
  it.each(configs.map((c) => [c.name, c] as const))("%s", (_name, Config) => {
    const instance = new Config() as unknown as Record<string, unknown>;
    const record = (Config.default as Record<string, Record<string, unknown>>)["user"];
    expect(record).toBeDefined();
    for (const [key, value] of Object.entries(record)) {
      expect(instance[key], key).toEqual(value);
    }
  });

  // /default/{start,end} の icon だけは意図的な差分: 旧ビルド保存のレコードに icon が
  // 無い場合は null（Chrome 既定アイコン）にフォールバックするのが現行挙動のため除外する。
  it("NotificationConfig は全レコードで一致（/default/* の icon を除く）", () => {
    const instance = new NotificationConfig() as unknown as Record<string, unknown>;
    const defaults = NotificationConfig.default as Record<string, Record<string, unknown>>;
    for (const [id, record] of Object.entries(defaults)) {
      for (const [key, value] of Object.entries(record)) {
        if (id.startsWith("/default/") && key === "icon") continue;
        expect(instance[key], `${id} ${key}`).toEqual(value);
      }
    }
  });
});
