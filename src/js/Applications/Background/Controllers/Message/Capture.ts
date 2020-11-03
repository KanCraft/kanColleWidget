/**
 * スクショとかそういうの
 */
import CaptureService from "../../../../Services/Capture";
import Rectangle, { RectParam } from "../../../../Services/Rectangle";
import TrimService from "../../../../Services/Trim";
import WindowService from "../../../../Services/Window";
import TempStorage from "../../../../Services/TempStorage";
import ScreenshotSetting from "../../../Models/Settings/ScreenshotSetting";
import DownloadService from "../../../../Services/Download";
import NotificationService from "../../../../Services/Notification";

/**
 * @MESSAGE /capture/screenshot
 * @param {boolean} message.open 撮った画像をそのままどっかのウィンドウで開くかどうかっていう
 * @param {RectParam?} message.rect
 */
export async function Screenshot(
  message: { open: boolean, rect?: RectParam } = { open: true }
): Promise<{ status: number, uri?: string }> {
  const ws = WindowService.getInstance();
  const tab = await ws.find();
  if (!tab /* || !ws.knows(tab.id) */) {
    return {status: 404};
  }
  const setting = ScreenshotSetting.user();
  const cs = new CaptureService();
  const original = await cs.base64(tab.windowId, { format: setting.format });
  const ts = await TrimService.init(original);
  const rect = Rectangle.new(ts.img.width, ts.img.height);
  const area = message.rect ? rect.reframe(message.rect) : rect.game();
  const trimmed = ts.trim(area);

  if (!message.open) return {status: 202, uri: trimmed};

  if (setting.skipPage) {
    const service = DownloadService.new();
    const filename = setting.getFullDownloadPath();
    await service.download({ url: trimmed, filename });
    new NotificationService().create(`Screenshot?ts=${Date.now()}`, {
      iconUrl: trimmed,
      title: "スクリーンショットを保存",
      message: filename,
    });
  } else {
    const key = await TempStorage.new().store(`capture_${Date.now()}`, trimmed);
    WindowService.getInstance().openCapturePage({ key });
  }

  return {status: 202, uri: trimmed};
}
