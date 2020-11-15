import NotificationService from "../../../../Services/Notification";
import WindowService from "../../../../Services/Window";

async function clearNotification(id: string) {
  const ns = new NotificationService();
  await ns.clear(id);
}

export async function OnNotificationClick(id: string): Promise<void> {
  await clearNotification(id);
  const ws = WindowService.getInstance();
  await ws.backToGame();
}

export async function OnMissionNotFoundClick(id: string): Promise<void> {
  await clearNotification(id);
  const mid = new URLSearchParams(id.split("?")[1]).get("mid");
  const url = new URL("https://github.com/KanCraft/kanColleWidget/issues/new");
  url.searchParams.set("title", `遠征IDの追加: ${mid}`);
  url.searchParams.set("labels", "機能要望");
  url.searchParams.set("body", `遠征ID ${mid} 確認ください\n\n- https://wikiwiki.jp/kancolle/%E9%81%A0%E5%BE%81\n- https://github.com/KanCraft/kanColleWidget/blob/develop/src/js/Applications/Models/Queue/missions.ts`);
  window.open(url.toString());
}

export async function OnUpdateAvailableClick(id: string): Promise<void> {
  await clearNotification(id);
  const url = `chrome://extensions/?id=${chrome.runtime.id}`;
  chrome.tabs.create({ url });
}
