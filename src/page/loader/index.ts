import { PermissionsService } from "../../services/PermissionsService";
import { servers } from "../../catalog";
import { Frame } from "../../models/Frame";
import Queue from "../../models/Queue";
import note from "../../release-note.json"
import { ReleaseNoteObject } from "../components/options/DevelopmentInfoView";
import { Launcher } from "../../services/Launcher";

export async function options() {
  const perms = new PermissionsService();
  const ss = await perms.servers.granted(servers);
  const frames = await Frame.list();
  const releasenote = note as ReleaseNoteObject;
  return { servers: ss, frames, releasenote };
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
  }
}