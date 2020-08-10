import { Router } from "chomex";
import { ScreenshotCommand } from "../Controllers/Command";

const resolve = (name) => {
  return { name };
};

const router = new Router(resolve);

router.on("screenshot", ScreenshotCommand);

export default router.listener();
