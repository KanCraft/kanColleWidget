import { Frame } from "../../models/Frame";
import { resolveDefaultFrameId } from "../../models/popupDefaultFrame";
import Queue from "../../models/Queue";
import note from "../../release-note.json"
import { ReleaseNoteObject } from "../components/options/DevelopmentInfoView";
import { Launcher } from "../../services/Launcher";
import { FileSaveConfig } from "../../models/configs/FileSaveConfig";
import { DashboardConfig } from "../../models/configs/DashboardConfig";
import { DamageSnapshotConfig } from "../../models/configs/DamageSnapshotConfig";
import { BehaviorConfig } from "../../models/configs/BehaviorConfig";
import { GameWindowConfig } from "../../models/configs/GameWindowConfig";
import { NotificationConfig, QUEST_ALERT_NOTIFICATION_ID } from "../../models/configs/NotificationConfig";
import { EntryType, NotificationId, TIMER_ENTRY_TYPES, TriggerType } from "../../models/entry";
import { Logbook } from "../../models/Logbook";
import { CapturePreset } from "../../models/CapturePreset";
import { FleetCaptureConfig } from "../../models/configs/FleetCaptureConfig";
import { QuestTrackerConfig } from "../../models/configs/QuestTrackerConfig";
import { QuestProgress } from "../../models/QuestProgress";

type NotificationConfigPair = Record<TriggerType.START | TriggerType.END, NotificationConfig>;

// 種別1つ分の 開始/完了 通知設定レコードを取得する。
async function notificationConfigPair(type: string): Promise<NotificationConfigPair> {
  return {
    [TriggerType.START]: (await NotificationConfig.find(NotificationId.configKey(type, TriggerType.START)))!,
    [TriggerType.END]: (await NotificationConfig.find(NotificationId.configKey(type, TriggerType.END)))!,
  };
}

export async function options() {
  const frames = await Frame.list();
  const game = await GameWindowConfig.user();
  const filesave = await FileSaveConfig.user();
  const dashboard = await DashboardConfig.user();
  const damagesnapshot = await DamageSnapshotConfig.user();
  const behavior = await BehaviorConfig.user();
  const notificationDefaults = await notificationConfigPair(EntryType.TEST_DEFAULT);
  const timerNotificationEntries = Object.fromEntries(
    await Promise.all(
      TIMER_ENTRY_TYPES.map(async (type) => [type, await notificationConfigPair(type)] as const),
    ),
  ) as Record<typeof TIMER_ENTRY_TYPES[number], NotificationConfigPair>;
  const notificationEntries = {
    ...timerNotificationEntries,
    [EntryType.UNKNOWN]: await notificationConfigPair(EntryType.TEST_DEFAULT),
  };
  const releasenote = note as ReleaseNoteObject;
  return {
    frames,
    game,
    releasenote,
    filesave,
    dashboard,
    damagesnapshot,
    behavior,
    notification: {
      defaults: notificationDefaults,
      entries: notificationEntries,
    },
    capturePresets: await CapturePreset.list(),
    fleetcapture: await FleetCaptureConfig.user(),
    questAlert: (await NotificationConfig.find(QUEST_ALERT_NOTIFICATION_ID))!,
    questTracker: await QuestTrackerConfig.user(),
  };
}

export async function fleetcapture() {
  return {
    presets: await CapturePreset.list(),
  };
}

export async function popup() {
  const frames = await Frame.list();
  // 前回ポップアップで選択（起動）した Frame を初期選択として復元する（#1236）。
  // 解決ロジック（削除済みIDのフォールバック含む）は resolveDefaultFrameId に切り出してテストしている。
  const game = await GameWindowConfig.user();
  const defaultFrameId = resolveDefaultFrameId(frames.map((f) => f._id!), game.lastSelectedFrameId);
  return {
    frames,
    defaultFrameId,
  };
}

export async function dashboard() {
  const win = await (new Launcher()).find();
  const game = await GameWindowConfig.user();
  return {
    queues: await Queue.list(),
    window: win,
    time: new Date(),
    frameId: game.lastSelectedFrameId,
    questTrackerConfig: await QuestTrackerConfig.user(),
    questProgress: await QuestProgress.user(),
    config: await DashboardConfig.user(),
  }
}

export async function damagesnapshot() {
  return {};
}

export async function logbook() {
  return {
    sorties: await Logbook.list(),
  };
}

export async function questTracker() {
  return {
    progress: await QuestProgress.user(),
  };
}