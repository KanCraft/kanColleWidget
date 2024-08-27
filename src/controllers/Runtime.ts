import { servers } from "../catalog";
import { PermissionsService } from "../services/PermissionsService";

export async function onInstalled() {
  const perms = new PermissionsService();
  const ss = await perms.servers.granted(servers);
  if (!ss.some(s => s.granted)) {
    chrome.tabs.create({
      url: chrome.runtime.getURL("page/index.html#/options?open=server-perms"),
    });
  }
}