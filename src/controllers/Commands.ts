import { Router } from "chromite";
import { Launcher } from "../services/Launcher";
import { ScreenshotService } from "../services/ScreenshotService";

const onCommand = new Router<typeof chrome.commands.onCommand>(async (command) => ({ __action__: command }));

onCommand.on("/screenshot", async () => {
  const launcher = new Launcher();
  const win = await launcher.find();
  if (!win || typeof win.id !== "number") {
    throw new Error("スクリーンショット対象のウィンドウが見つかりませんでした");
  }
  return await ScreenshotService.take(win.id);
});

export {
  onCommand,
}
