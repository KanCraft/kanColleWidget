import { PermissionsService } from "../../services/PermissionsService";
import { servers } from "../../catalog";
import { Frame } from "../../models/Frame";

export async function serverpermissions() {
  const perms = new PermissionsService();
  const ss = await perms.servers.granted(servers);
  return { servers: ss };
}

export async function popup() {
  return {
    frames: await Frame.list(),
  };
}