import { PermissionsService } from "../../services/PermissionsService";
import { servers } from "../../catalog";
import { Frame } from "../../models/Frame";

export async function options() {
  const perms = new PermissionsService();
  const ss = await perms.servers.granted(servers);
  const frames = await Frame.list();
  return { servers: ss, frames };
}

export async function popup() {
  return {
    frames: await Frame.list(),
  };
}