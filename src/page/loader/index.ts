import { PermissionsService } from "../../services/PermissionsService";
import { servers } from "../../catalog";

export async function serverpermissions() {
  const perms = new PermissionsService();
  const ss = await perms.servers.granted(servers);
  return { servers: ss };
}