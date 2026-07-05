import { Router } from "chromite";
import { Launcher } from "../services/Launcher";
import { ScreenshotService } from "../services/ScreenshotService";
import { FileSaveConfig } from "../models/configs/FileSaveConfig";

const onCommand = new Router<typeof chrome.commands.onCommand>(async (command) => ({ __action__: command }));

onCommand.on("/screenshot", async () => {
  const launcher = new Launcher();
  const win = await launcher.find();
  if (!win || typeof win.id !== "number") {
    throw new Error("スクリーンショット対象のウィンドウが見つかりませんでした");
  }
  const config = await FileSaveConfig.user();
  const uri = await launcher.capture(win.id, { format: config.format });
  return await new ScreenshotService(config).deliver(uri);
});

export {
  onCommand,
}
