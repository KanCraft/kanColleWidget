import NotificationService from "../../../../Services/Notification";
import WindowService from "../../../../Services/Window";

export async function OnNotificationClick(id: string) {
  const ns = new NotificationService();
  await ns.clear(id);
  const ws = WindowService.getInstance();
  await ws.backToGame();
}
