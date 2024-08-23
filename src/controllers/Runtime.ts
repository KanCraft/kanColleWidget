import { Logger } from "chromite";
import { servers } from "../catalog";
import { PermissionsService } from "../services/PermissionsService";

export async function onInstalled() {
    const log = new Logger("onInstalled");
    const perms = new PermissionsService();
    const ss = await perms.servers.granted(servers);
    log.debug(ss.filter((s) => s.granted));
}