/**
 * スクショとかそういうの
 */
import { Client } from "chomex/lib/Client";
import CaptureService from "../../../../Services/Capture";
import Rectangle from "../../../../Services/Rectangle";
import TrimService from "../../../../Services/Trim";
import WindowService from "../../../../Services/Window";
import { sleep } from "../../../../utils";

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
  const page = await ws.capturePage();
  setTimeout(() => {
    Client.for(chrome.tabs, page.id, false).message("/capture/show", {uri: trimmed});
  }, 100);
  return {status: 202};
}
