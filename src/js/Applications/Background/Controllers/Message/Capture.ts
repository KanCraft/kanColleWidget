/**
 * スクショとかそういうの
 */
import CaptureService from "../../../../Services/Capture";
import Rectangle from "../../../../Services/Rectangle";
import TrimService from "../../../../Services/Trim";
import WindowService from "../../../../Services/Window";

export async function Screenshot() {
  const ws = WindowService.getInstance();
  const tab = await ws.find();
  if (!tab /* || !ws.knows(tab.id) */) {
    return {status: 404};
  }
  const cs = new CaptureService();
  const original = await cs.base64(tab.windowId, {});
  const ts = await TrimService.init(original);
  const rect = Rectangle.new(ts.img.width, ts.img.height);
  const trimmed = ts.trim(rect.game());
  chrome.alarms.create(`/screenshot?uri=${encodeURIComponent(trimmed)}`, {when: Date.now() + 100});
  return {status: 202, uri: trimmed};
}
