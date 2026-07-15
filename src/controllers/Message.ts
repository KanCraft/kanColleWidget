import { Router } from "chromite";
import { Logger } from "../logger";
import { Frame } from "../models/Frame";
import { type Page } from "tesseract.js";
import { EntryType, Recovery, Shipbuild } from "../models/entry";
import { parseHMS, sleep, WorkerImage } from "../utils";
import Queue from "../models/Queue";
import { TriggerType } from "../models/entry";
import { Launcher } from "../services/Launcher";
import { ScreenshotService } from "../services/ScreenshotService";
import { CropService } from "../services/CropService";
import { TabService } from "../services/TabService";
import { DashboardConfig } from "../models/configs/DashboardConfig";
import { DamageSnapshotConfig, DamageSnapshotMode } from "../models/configs/DamageSnapshotConfig";
import { GameWindowConfig } from "../models/configs/GameWindowConfig";
import { NotificationService } from "../services/NotificationService";
import { Logbook } from "../models/Logbook";
import { formatSortieLabel } from "../models/sortieLabel";
import { Routes, ocrResultRoute } from "../messages";
import type { Route, DsnapshotShowPayload, DsnapshotSeparatePushPayload } from "../messages";

const onMessage = new Router<typeof chrome.runtime.onMessage>();
const log = Logger.get("Message");

onMessage.on(Routes.FRAME_OPEN_OR_FOCUS, async (req) => {
  const launcher = new Launcher();
  const id = req.frame_id;
  const frame = (await Frame.find(id)) ?? (await Frame.memory());
  // launch() はゲーム窓を新規作成したとき true を返す（#1216）
  const created = await launcher.launch(frame);
  // 設定 ON かつ新規作成時のみ、ダッシュボードも同時に開く（#1216）。
  // Launcher.dashboard() は open-or-focus なので、既にDBが開いていれば focus されるだけ。
  if ((await DashboardConfig.user()).shouldOpenOnLaunch(created)) {
    await Launcher.dashboard();
  }
  return created;
});

onMessage.on(Routes.FRAME_MEMORY_TRACK, async (req) => {
  const frame = await Frame.memory();
  return await frame.update({ position: req.position, size: req.size });
});

/**
 * __memory__ の記憶（位置・サイズ）を削除し、次回参照時に既定値へフォールバックさせる。
 * アスペクト比や絶対サイズでの自動判定は、ユーザーが意図的にゲームのネイティブ比率と異なる
 * 形へ窓をカスタマイズする正規のユースケースと区別できないため採用しない（#1848）。
 * ユーザーが能動的に選んだときだけ実行される、安全な手動リセット導線とする。
 */
onMessage.on(Routes.FRAME_MEMORY_RESET, async () => {
  return await (await Frame.memory()).delete();
});

/**
 * dmm.ts の自己診断（#game_frame の実寸が100vw/100vh相当かのチェック）でズレを検知した際に、
 * 次のナビゲーションイベントを待たずにゲーム別窓を再活性化する（#1848）。
 */
onMessage.on(Routes.FRAME_SELF_CHECK_MISMATCH, async (_, sender) => {
  if (!sender.tab?.windowId) return;
  const win = await chrome.windows.get(sender.tab.windowId, { populate: true });
  return await (new Launcher()).reactivate(win);
});

/**
 * ダッシュボードウィンドウの位置・サイズを保存する
 * @param req.left 左位置
 * @param req.top 上位置
 * @param req.width 幅
 * @param req.height 高さ
 */
onMessage.on(Routes.DASHBOARD_TRACK, async (req) => {
  const dashboard = await DashboardConfig.user();
  return await dashboard.update({ left: req.left, top: req.top, width: req.width, height: req.height });
});

onMessage.on(Routes.MUTE_TOGGLE, async (_, sender) => {
  if (!sender.tab || !sender.tab.mutedInfo) return;
  const muted = !sender.tab.mutedInfo.muted;
  (await Frame.memory()).update({ muted });
  return await chrome.tabs.update(sender.tab!.id!, { muted });
});

onMessage.on(Routes.SCREENSHOT, async (_, sender) => {
  if (!sender.tab) return;
  return await ScreenshotService.take(sender.tab.windowId);
});

onMessage.on(ocrResultRoute(EntryType.RECOVERY), async (req) => {
  const data = req.data as Page;
  const dock = req[EntryType.RECOVERY].dock;
  // 同じドックの既存Queueを削除してから積み直す（speedchange検知漏れ等で古いQueueが
  // 残っていても、次に同じドックで修復を始めた時点で重複が解消されるようにする保険）。
  // 修復が始まった事実に基づく掃除なので、OCR結果の成否に依らず行う。
  await Queue.deleteSlot(EntryType.RECOVERY, dock);
  const time = parseHMS(data.text);
  if (time === null) {
    log.warn("修復時間のOCR結果を時刻として解釈できないため、タイマーを登録しない", data.text);
    return;
  }
  const r = new Recovery(dock, time);
  const q = await Queue.create({ type: EntryType.RECOVERY, params: r, scheduled: Date.now() + r.time });
  const e = q.entry();
  NotificationService.new().notify(e, TriggerType.START);
});

onMessage.on(ocrResultRoute(EntryType.SHIPBUILD), async (req) => {
  const data = req.data as Page;
  const dock = req[EntryType.SHIPBUILD].dock;
  // 建造が始まった事実に基づく掃除なので、OCR結果の成否に依らず行う。
  await Queue.deleteSlot(EntryType.SHIPBUILD, dock);
  const time = parseHMS(data.text);
  if (time === null) {
    log.warn("建造時間のOCR結果を時刻として解釈できないため、タイマーを登録しない", data.text);
    return;
  }
  const sb = new Shipbuild(dock, time);
  const q = await Queue.create({ type: EntryType.SHIPBUILD, params: sb, scheduled: Date.now() + sb.time });
  const e = q.entry();
  NotificationService.new().notify(e, TriggerType.START);
});

onMessage.on(Routes.DAMAGE_SNAPSHOT_CAPTURE, async (req, sender) => {
  const { after, timestamp } = req;
  await sleep(after || 1000); // 描画待ち
  const raw = await new TabService().capture(sender.tab!.windowId, { format: "jpeg" });
  const img = await WorkerImage.from(raw);
  const uri = await (new CropService(img)).crop("damagesnapshot");

  const config = await DamageSnapshotConfig.user();
  // 出撃中の「海域 (連戦数)」ラベルを組み立てる（#1764）。出撃コンテキストが取れない場合は
  // null になり、表示側はラベルを描画しない（従来どおり画像のみ）。
  const label = formatSortieLabel(Logbook.sortie.map, Logbook.sortie.battles.length, config.areaLabelFormat);
  switch (config.mode) {
  case DamageSnapshotMode.DISABLED:
    return;
  case DamageSnapshotMode.INAPP:
    return chrome.tabs.sendMessage(sender.tab!.id!, { __action__: Routes.DSNAPSHOT_SHOW, uri, timestamp, heightRatio: config.heightRatio, label } satisfies { __action__: Route<"DSNAPSHOT_SHOW"> } & DsnapshotShowPayload);
  case DamageSnapshotMode.SEPARATE: {
    const win = await Launcher.damagesnapshot(config);
    if (!win || !win.tabs || !win.tabs[0].id) throw new Error("Failed to get damage snapshot window");
    return chrome.tabs.sendMessage(win.tabs[0].id, { __action__: Routes.DSNAPSHOT_SEPARATE_PUSH, uri, timestamp, label } satisfies { __action__: Route<"DSNAPSHOT_SEPARATE_PUSH"> } & DsnapshotSeparatePushPayload);
  }
  }
});

onMessage.on(Routes.CONFIGS, async () => {
  const game = await GameWindowConfig.user();
  return { game };
});

export { onMessage };
