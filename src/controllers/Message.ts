import { Logger, Router } from "chromite";
import { Frame } from "../models/Frame";
import { type Page } from "tesseract.js";
import { EntryType, Recovery } from "../models/entry";
import { H, M, S, sleep } from "../utils";
import Queue from "../models/Queue";
import { TriggerType } from "../models/entry/Base";

const onMessage = new Router<chrome.runtime.ExtensionMessageEvent>();

onMessage.on("/frame/memory:track", async (req) => {
  const frame = await Frame.memory();
  return await frame.update({ position: req.position, size: req.size });
});

onMessage.on("/injected/dmm/ocr:result", async (req) => {
  const data = req.data as Page;
  const dock = req[EntryType.RECOVERY].dock;
  const [h, m, s] = data.text.split(":").map(Number);
  new Logger("ocr").info({ h, m, s });
  const r = new Recovery(dock, (h * H + m * M + s * S));
  await Queue.create({ type: EntryType.RECOVERY, params: r, scheduled: Date.now() + r.time });
  await chrome.notifications.create(r.$n.id(TriggerType.START), r.$n.options(TriggerType.START));
  await sleep(6 * 1000);
  await chrome.notifications.clear(r.$n.id(TriggerType.START));
});

export { onMessage };