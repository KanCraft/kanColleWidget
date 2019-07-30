import { Router } from "chomex";
import NotificationService from "../../../Services/Notification";

const resolver = (id: string) => {
    const [name /* , query */] = id.split("?");
    return {name};
};

const router = new Router(resolver);

router.on("Mission", async (id) => {
    const ns = new NotificationService();
    await ns.clear(id);
});

router.on("Recovery", async (id) => {
    const ns = new NotificationService();
    await ns.clear(id);
});

router.on("Shipbuilding", async (id) => {
    const ns = new NotificationService();
    await ns.clear(id);
});

export default router.listener();
