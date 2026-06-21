import { Frame } from "../../models/Frame";
import Queue from "../../models/Queue";
import note from "../../release-note.json"
import { ReleaseNoteObject } from "../components/options/DevelopmentInfoView";
import { Launcher } from "../../services/Launcher";
import { FileSaveConfig } from "../../models/configs/FileSaveConfig";
import { DashboardConfig } from "../../models/configs/DashboardConfig";
import { DamageSnapshotConfig } from "../../models/configs/DamageSnapshotConfig";
import { GameWindowConfig } from "../../models/configs/GameWindowConfig";
import { NotificationConfig } from "../../models/configs/NotificationConfig";
import { EntryType, TriggerType } from "../../models/entry";
import { Logbook } from "../../models/Logbook";

export async function options() {
  const frames = await Frame.list();
  const game = await GameWindowConfig.user();
  const filesave = await FileSaveConfig.user();
  const dashboard = await DashboardConfig.user();
  const damagesnapshot = await DamageSnapshotConfig.user();
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
    notification: {
      defaults: notificationDefaults,
      entries: notificationEntries,
    },
  };
}

export async function popup() {
  const frames = await Frame.list();
  // 前回ポップアップで選択（起動）した Frame を初期選択として復元する（#1236）。
  // 保存IDが現在の Frame 一覧に無い（削除済み等）場合は MEMORY にフォールバックする。
  const game = await GameWindowConfig.user();
  const defaultFrameId = frames.some((f) => f._id === game.lastSelectedFrameId)
    ? game.lastSelectedFrameId
    : "__memory__";
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