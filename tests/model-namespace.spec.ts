import { expect, describe, it, vi } from "vitest";

// NotificationConfig は static default の初期化で chrome.runtime.getURL を参照するため、
// import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", getURL: (path: string) => `chrome-extension://test/${path}` },
  };
});

import Queue from "../src/models/Queue";
import { CapturePreset } from "../src/models/CapturePreset";
import { Frame } from "../src/models/Frame";
import { SortieContext } from "../src/models/Logbook";
import { DashboardConfig } from "../src/models/configs/DashboardConfig";
import { DamageSnapshotConfig } from "../src/models/configs/DamageSnapshotConfig";
import { FileSaveConfig } from "../src/models/configs/FileSaveConfig";
import { FleetCaptureConfig } from "../src/models/configs/FleetCaptureConfig";
import { GameWindowConfig } from "../src/models/configs/GameWindowConfig";
import { NotificationConfig } from "../src/models/configs/NotificationConfig";
import { QuestTrackerConfig } from "../src/models/configs/QuestTrackerConfig";
import { QuestProgress } from "../src/models/QuestProgress";

// jstorm の Model は _namespace_ が未指定だとクラス名を chrome.storage.local のキーに使う。
// minify でクラス名はビルドごとに変わる短縮名になるため、_namespace_ を明示しないモデルは
// ビルドのたびに保存キーが変わり、保存済みデータが黙って初期値に戻る。
// ここでは全モデルが _namespace_ を非空文字列で明示していることを検証する。
const models = [
  Queue,
  CapturePreset,
  Frame,
  SortieContext,
  DashboardConfig,
  DamageSnapshotConfig,
  FileSaveConfig,
  FleetCaptureConfig,
  GameWindowConfig,
  NotificationConfig,
  QuestTrackerConfig,
  QuestProgress,
] as const;

describe("jstorm モデルの _namespace_", () => {
  it.each(models.map((model) => [model.name, model] as const))(
    "%s は _namespace_ を非空文字列で明示している",
    (_name, model) => {
      expect(model._namespace_).toBeTypeOf("string");
      expect(model._namespace_).not.toBe("");
    },
  );
});
