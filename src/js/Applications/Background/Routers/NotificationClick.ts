import { Router } from "chomex";
import NotificationService from "../../../Services/Notification";

const resolver = (id) => {
  const [name, query] = id.name.split("?");
  return {name};
};

const router = new Router(resolver);

router.on("Mission", async (id) => {
  const ns = new NotificationService();
  await ns.clear(id);
});

export default router.listener();
