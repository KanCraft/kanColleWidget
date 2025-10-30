import { Frame } from "../../models/Frame";
import Queue from "../../models/Queue";
import note from "../../release-note.json"
import { ReleaseNoteObject } from "../components/options/DevelopmentInfoView";
import { Launcher } from "../../services/Launcher";
import { FileSaveConfig } from "../../models/configs/FileSaveConfig";
import { DashboardConfig } from "../../models/configs/DashboardConfig";
import { DamageSnapshotConfig } from "../../models/configs/DamageSnapshotConfig";
import { GameWindowConfig } from "../../models/configs/GameWindowConfig";

export async function options() {
  const frames = await Frame.list();
  const game = await GameWindowConfig.user();
  const filesave = await FileSaveConfig.user();
  const dashboard = await DashboardConfig.user();
  const damagesnapshot = await DamageSnapshotConfig.user();
  const releasenote = note as ReleaseNoteObject;
  return { frames, game, releasenote, filesave, dashboard, damagesnapshot };
}

export async function popup() {
  return {
    frames: await Frame.list(),
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