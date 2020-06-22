/**
 * スクショとかそういうの
 */
import CaptureService from "../../../../Services/Capture";
import Rectangle, { RectParam } from "../../../../Services/Rectangle";
import TrimService from "../../../../Services/Trim";
import WindowService from "../../../../Services/Window";

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
  const cs = new CaptureService();
  const original = await cs.base64(tab.windowId, {});
  const ts = await TrimService.init(original);
  const rect = Rectangle.new(ts.img.width, ts.img.height);
  const area = message.rect ? rect.reframe(message.rect) : rect.game();
  const trimmed = ts.trim(area);
  if (message.open) {
    chrome.alarms.create(`/screenshot?uri=${encodeURIComponent(trimmed)}`, {when: Date.now() + 100});
  }
  return {status: 202, uri: trimmed};
}
