import { Router } from "chromite";
import { Frame } from "../models/Frame";
import { type Page } from "tesseract.js";
import { EntryType, Recovery, Shipbuild } from "../models/entry";
import { H, M, S, sleep, WorkerImage } from "../utils";
import Queue from "../models/Queue";
import { TriggerType } from "../models/entry/Base";
import { Launcher } from "../services/Launcher";
import { DownloadService } from "../services/DownloadService";
import { CropService } from "../services/CropService";
import { FileSaveConfig } from "../models/configs/FileSaveConfig";
import { DashboardConfig } from "../models/configs/DashboardConfig";

const onMessage = new Router<chrome.runtime.ExtensionMessageEvent>();

onMessage.on("/frame/open-or-focus", async (req) => {
  const launcher = new Launcher();
  let frame: Frame | null = null;
  if (typeof req.frame_id === "string" && req.frame_id.length > 0) {
    frame = await Frame.find(req.frame_id);
  }
  if (!frame) {
    frame = await Frame.memory();
  }
  await launcher.launch(frame);
  return { opened: true, frame_id: frame._id ?? null };
});

onMessage.on("/frame/memory:track", async (req) => {
  const frame = await Frame.memory();
  return await frame.update({ position: req.position, size: req.size });
});

/**
 * ダッシュボードウィンドウの位置・サイズを保存する
 * @param req.left 左位置
 * @param req.top 上位置
 * @param req.width 幅
 * @param req.height 高さ
 */
onMessage.on("/dashboard:track", async (req) => {
  const dashboard = await DashboardConfig.user();
  return await dashboard.update({ left: req.left, top: req.top, width: req.width, height: req.height });
});

onMessage.on("/mute:toggle", async (_, sender) => {
  if (!sender.tab || !sender.tab.mutedInfo) return;
  return await chrome.tabs.update(sender.tab!.id!, { muted: !sender.tab.mutedInfo.muted });
});

onMessage.on("/screenshot", async (_, sender) => {
  if (!sender.tab) return;
  const launcher = new Launcher();
  const config = await FileSaveConfig.user();
  const s = new DownloadService(config);
  const format = "png";
  const uri = await launcher.capture(sender.tab.windowId, { format });
  return await s.download(uri);
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
  const { after, timestamp } = req;
  await sleep(after || 1000); // 描画待ち
  const raw = await chrome.tabs.captureVisibleTab(sender.tab!.windowId, { format: "jpeg" });
  const img = await WorkerImage.from(raw);
  const uri = await (new CropService(img)).crop("damagesnapshot");
  chrome.tabs.sendMessage(sender.tab!.id!, { __action__: "/injected/kcs/dsnapshot:show", uri, timestamp });
})

export { onMessage };
