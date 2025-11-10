import { Router } from "chromite";
import { Frame } from "../models/Frame";
import { type Page } from "tesseract.js";
import { EntryType, Recovery, Shipbuild } from "../models/entry";
import { H, M, S, sleep, WorkerImage } from "../utils";
import Queue from "../models/Queue";
import { TriggerType } from "../models/entry";
import { Launcher } from "../services/Launcher";
import { DownloadService } from "../services/DownloadService";
import { CropService } from "../services/CropService";
import { FileSaveConfig } from "../models/configs/FileSaveConfig";
import { DashboardConfig } from "../models/configs/DashboardConfig";
import { DamageSnapshotConfig, DamageSnapshotMode } from "../models/configs/DamageSnapshotConfig";
import { GameWindowConfig } from "../models/configs/GameWindowConfig";
import { NotificationService } from "../services/NotificationService";

const onMessage = new Router<typeof chrome.runtime.onMessage>();

onMessage.on("/frame/open-or-focus", async (req) => {
  const launcher = new Launcher();
  const id = req.frame_id;
  const frame = (await Frame.find(id)) ?? (await Frame.memory());
  return await launcher.launch(frame);
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
  const muted = !sender.tab.mutedInfo.muted;
  (await Frame.memory()).update({ muted });
  return await chrome.tabs.update(sender.tab!.id!, { muted });
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
  const q = await Queue.create({ type: EntryType.RECOVERY, params: r, scheduled: Date.now() + r.time });
  const e = q.entry();
  NotificationService.new().notify(e, TriggerType.START);
});

onMessage.on(`/injected/dmm/ocr/${EntryType.SHIPBUILD}:result`, async (req) => {
  const data = req.data as Page;
  const dock = req[EntryType.SHIPBUILD].dock;
  const [h, m, s] = data.text.split(":").map(Number);
  const sb = new Shipbuild(dock, (h * H + m * M + s * S));
  const q = await Queue.create({ type: EntryType.SHIPBUILD, params: sb, scheduled: Date.now() + sb.time });
  const e = q.entry();
  NotificationService.new().notify(e, TriggerType.START);
});

onMessage.on("/damage-snapshot/capture", async (req, sender) => {
  const { after, timestamp } = req;
  await sleep(after || 1000); // 描画待ち
  const raw = await chrome.tabs.captureVisibleTab(sender.tab!.windowId, { format: "jpeg" });
  const img = await WorkerImage.from(raw);
  const uri = await (new CropService(img)).crop("damagesnapshot");

  const config = await DamageSnapshotConfig.user();
  switch (config.mode) {
  case DamageSnapshotMode.DISABLED:
    return;
  case DamageSnapshotMode.INAPP:
    return chrome.tabs.sendMessage(sender.tab!.id!, { __action__: "/injected/kcs/dsnapshot:show", uri, timestamp });
  case DamageSnapshotMode.SEPARATE: {
    const win = await Launcher.damagesnapshot(config);
    if (!win || !win.tabs || !win.tabs[0].id) throw new Error("Failed to get damage snapshot window");
    return chrome.tabs.sendMessage(win.tabs[0].id, { __action__: "/dsnapshot/separate:push", uri, timestamp });
  }
  }
});

onMessage.on("/configs", async () => {
  const game = await GameWindowConfig.user();
  return { game };
});

export { onMessage };
