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
import { NotificationConfig } from "../../models/configs/NotificationConfig";
import { EntryType, TriggerType } from "../../models/entry";
import { Logbook } from "../../models/Logbook";
import { CapturePreset } from "../../models/CapturePreset";
import { FleetCaptureConfig } from "../../models/configs/FleetCaptureConfig";

export async function options() {
  const frames = await Frame.list();
  const game = await GameWindowConfig.user();
  const filesave = await FileSaveConfig.user();
  const dashboard = await DashboardConfig.user();
  const damagesnapshot = await DamageSnapshotConfig.user();
  const behavior = await BehaviorConfig.user();
  const notificationDefaults = {
    [TriggerType.START]: (await NotificationConfig.find("/default/start"))!,
    [TriggerType.END]: (await NotificationConfig.find("/default/end"))!,
  };
  const notificationEntries = {
    [EntryType.MISSION]: {
      [TriggerType.START]: (await NotificationConfig.find("/mission/start"))!,
      [TriggerType.END]: (await NotificationConfig.find("/mission/end"))!,
    },
    [EntryType.RECOVERY]: {
      [TriggerType.START]: (await NotificationConfig.find("/recovery/start"))!,
      [TriggerType.END]: (await NotificationConfig.find("/recovery/end"))!,
    },
    [EntryType.SHIPBUILD]: {
      [TriggerType.START]: (await NotificationConfig.find("/shipbuild/start"))!,
      [TriggerType.END]: (await NotificationConfig.find("/shipbuild/end"))!,
    },
    [EntryType.FATIGUE]: {
      [TriggerType.START]: (await NotificationConfig.find("/fatigue/start"))!,
      [TriggerType.END]: (await NotificationConfig.find("/fatigue/end"))!,
    },
    [EntryType.UNKNOWN]: {
      [TriggerType.START]: (await NotificationConfig.find("/default/start"))!,
      [TriggerType.END]: (await NotificationConfig.find("/default/end"))!,
    },
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
  return {
    queues: await Queue.list(),
    window: win,
    time: new Date(),
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