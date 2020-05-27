import { Router } from "chomex";
import NotificationService from "../../../Services/Notification";
import WindowService from "../../../Services/Window";

const resolver = (id: string) => {
  const [name /*, query*/] = id.split("?");
  return { name };
};

const router = new Router(resolver);

router.on("Mission", async (id) => {
  const ns = new NotificationService();
  await ns.clear(id);
  const ws = WindowService.getInstance();
  await ws.backToGame();
});

router.on("Recovery", async (id) => {
  const ns = new NotificationService();
  await ns.clear(id);
  const ws = WindowService.getInstance();
  await ws.backToGame();
});

router.on("Shipbuilding", async (id) => {
  const ns = new NotificationService();
  await ns.clear(id);
  const ws = WindowService.getInstance();
  await ws.backToGame();
});

export default router.listener();
