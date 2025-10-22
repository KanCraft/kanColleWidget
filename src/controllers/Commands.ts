import { Router } from "chromite";
import { Launcher } from "../services/Launcher";
import { DownloadService } from "../services/DownloadService";

const onCommand = new Router<chrome.commands.CommandEvent>(async (command) => {
  return { __action__: command };
});

onCommand.on("/screenshot", async (_command) => {
  const launcher = new Launcher();
  const win = await launcher.find();
  const service = new DownloadService();
  const format = "png";
  const uri = await launcher.capture(win?.id!, { format });
  const dir = "艦これ";
  return await service.download(uri, DownloadService.filename.screenshot({ dir, format }));

});

export {
  onCommand,
}