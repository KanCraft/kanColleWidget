import { Router } from "chromite";
import { Launcher } from "../services/Launcher";
import { DownloadService } from "../services/DownloadService";
import { FileSaveConfig } from "../models/configs/FileSaveConfig";

const onCommand = new Router<chrome.commands.CommandEvent>(async (command) => ({ __action__: command }));

onCommand.on("/screenshot", async () => {
  const launcher = new Launcher();
  const win = await launcher.find();
  if (!win || typeof win.id !== "number") {
    throw new Error("スクリーンショット対象のウィンドウが見つかりませんでした");
  }
  const config = await FileSaveConfig.user();
  const service = new DownloadService(config);
  // TODO: formatもconfigから取得できるようにする
  const format = "png"; 
  const uri = await launcher.capture(win.id, { format });
  return await service.download(uri);
});

export {
  onCommand,
}
