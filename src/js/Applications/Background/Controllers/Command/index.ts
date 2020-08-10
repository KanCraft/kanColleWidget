import { Screenshot } from "../Message/Capture";

export async function ScreenshotCommand() {
  return await Screenshot({open: true});
}
