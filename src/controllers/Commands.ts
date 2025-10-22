import { Router } from "chromite";
import { Launcher } from "../services/Launcher";
import { DownloadService } from "../services/DownloadService";

const onCommand = new Router<chrome.commands.CommandEvent>(async (command) => ({ __action__: command }));

onCommand.on("/screenshot", async () => {
  const launcher = new Launcher();
  const win = await launcher.find();
  if (!win || typeof win.id !== "number") {
    throw new Error("スクリーンショット対象のウィンドウが見つかりませんでした");
  }
  const service = new DownloadService();
  const format = "png";
  const uri = await launcher.capture(win.id, { format });
  const dir = "艦これ";
  return await service.download(uri, DownloadService.filename.screenshot({ dir, format }));
});

export {
  onCommand,
}
