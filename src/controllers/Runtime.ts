import { servers } from "../catalog";
import { PermissionsService } from "../services/PermissionsService";

export async function onInstalled() {
  const perms = new PermissionsService();
  const ss = await perms.servers.granted(servers);
  if (ss.filter(s => s.granted).length < 1) {
    chrome.tabs.create({
      url: chrome.runtime.getURL("page/index.html#/permissions"),
    });
  }
}