import { Router } from "chromite";
import { Frame } from "../models/Frame";
import { type Page } from "tesseract.js";
import { EntryType, Recovery, Shipbuild } from "../models/entry";
import { H, M, S, sleep } from "../utils";
import Queue from "../models/Queue";
import { TriggerType } from "../models/entry/Base";

const onMessage = new Router<chrome.runtime.ExtensionMessageEvent>();

onMessage.on("/frame/memory:track", async (req) => {
  const frame = await Frame.memory();
  return await frame.update({ position: req.position, size: req.size });
});

onMessage.on(`/injected/dmm/ocr/${EntryType.RECOVERY}:result`, async (req) => {
  const data = req.data as Page;
  const dock = req[EntryType.RECOVERY].dock;
  const [h, m, s] = data.text.split(":").map(Number);
  const r = new Recovery(dock, (h * H + m * M + s * S));
  await Queue.create({ type: EntryType.RECOVERY, params: r, scheduled: Date.now() + r.time });
  await chrome.notifications.create(r.$n.id(TriggerType.START), r.$n.options(TriggerType.START));
  await sleep(6 * 1000);
  await chrome.notifications.clear(r.$n.id(TriggerType.START));
});

onMessage.on(`/injected/dmm/ocr/${EntryType.SHIPBUILD}:result`, async (req) => {
  const data = req.data as Page;
  const dock = req[EntryType.SHIPBUILD].dock;
  const [h, m, s] = data.text.split(":").map(Number);
  const sb = new Shipbuild(dock, (h * H + m * M + s * S));
  await Queue.create({ type: EntryType.SHIPBUILD, params: sb, scheduled: Date.now() + sb.time });
  await chrome.notifications.create(sb.$n.id(TriggerType.START), sb.$n.options(TriggerType.START));
  await sleep(6 * 1000);
  await chrome.notifications.clear(sb.$n.id(TriggerType.START));
});

onMessage.on("/damage-snapshot/capture", async (req, sender) => {
  console.log("/damage-snapshot/capture", req, sender);
  const { after, timestamp } = req;
  await sleep(after || 1000); // 描画待ち
  const uri = await chrome.tabs.captureVisibleTab(sender.tab!.windowId, { format: "jpeg" });
  console.log("uri", uri);
  chrome.tabs.sendMessage(sender.tab!.id!, { __action__: "/injected/kcs/dsnapshot:show", uri, timestamp });
})

export { onMessage };