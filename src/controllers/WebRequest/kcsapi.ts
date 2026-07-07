import { Logger } from "../../logger";
import { missions } from "../../catalog";
import { sleep, WorkerImage } from "../../utils";
import Queue from "../../models/Queue";
import { CreateShipFormData, GetShipFormData, MapStartFormData, MissionResultFormData, MissionStartFormData, RecoveryStartFormData, RecoverySpeedchangeFormData, ShipbuildSpeedchangeFormData } from "./datatypes";
import { EntryType, Fatigue, Mission } from "../../models/entry";
import { TriggerType } from "../../models/entry";
import { TabService } from "../../services/TabService";
import { CropService } from "../../services/CropService";
import { NotificationService } from "../../services/NotificationService";
import { Launcher } from "../../services/Launcher";
import { Logbook } from "../../models/Logbook";
import { DamageSnapshotConfig } from "../../models/configs/DamageSnapshotConfig";
import { BehaviorConfig } from "../../models/configs/BehaviorConfig";

const log = Logger.get("WebRequest");

// 大破進撃防止窓を「戦闘開始時に」消す。ただしユーザ設定 keepUntilNextShow が有効なら消さず、
// 次のスナップショット表示時(osapi.show)の差し替えに前の窓の除去を委ねる（前の窓を粘らせる）。
// 母港帰投(onPort)は設定に関わらず常に消すので、この関数は戦闘開始系ハンドラだけで使う。
async function clearSnapshotOnBattleStart(details: chrome.webRequest.OnBeforeRequestDetails) {
  const config = await DamageSnapshotConfig.user();
  if (config.keepUntilNextShow) return;
  chrome.tabs.sendMessage(details.tabId, { __action__: "/injected/kcs/dsnapshot:remove" }, { frameId: details.frameId });
}

export async function onPort([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  chrome.tabs.sendMessage(details.tabId, { __action__: "/injected/kcs/dsnapshot:remove" }, { frameId: details.frameId });
  const dsnapshot = await new Launcher().getDsnapshotTab();
  if (dsnapshot) chrome.windows.remove(dsnapshot.windowId!);
  await Logbook.record();
}

export async function onMissionStart([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const data: MissionStartFormData = details.requestBody?.formData as unknown as MissionStartFormData;
  const did = data.api_deck_id[0];
  const mid = data.api_mission_id[0];
  const m = new Mission(did, mid, missions[mid]);
  // 遠征は残り1分を切ると母港復帰で即完了する仕様のため、通知を一律で1分早める（#1811, Mission.EARLY_RETURN_MARGIN）。
  // 入渠・建造はOCRで実時刻を読むためこの補正は不要。
  const scheduled = Date.now() + Math.max(0, m.time - Mission.EARLY_RETURN_MARGIN);
  // 同じ艦隊の既存Queueを削除してから積み直す（他端末での帰投操作等、検知できない経路で
  // 古いQueueが残っていても、同じ艦隊で次の遠征を始めた時点で解消される）。
  await Queue.deleteSlot(EntryType.MISSION, did);
  const q = await Queue.create({ type: EntryType.MISSION, params: m, scheduled });
  const e = q.entry();
  NotificationService.new().notify(e, TriggerType.START);
}

export async function onMissionReturnInstruction([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  log.debug("onMissionReturnInstruction", details);
}

// 指定タイプ・指定艦隊(ドック)の通知を全トリガー分消す。
// 通知IDは /{type}/{trigger}/{deck|dock} 形式（各 entry の $n.id 参照）。
async function clearNotificationsOf(type: EntryType, target: string) {
  const service = NotificationService.new();
  const notifications = await service.getAll();
  for (const id of Object.keys(notifications)) {
    if (id.startsWith(`/${type}/`) && id.endsWith(`/${target}`)) await service.clear(id);
  }
}

// 遠征結果を回収したとき、その艦隊の遠征通知（開始・完了）を消す
export async function onMissionResult([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const { api_deck_id: [deck] } = details.requestBody?.formData as unknown as MissionResultFormData;
  await clearNotificationsOf(EntryType.MISSION, deck);
}

export async function onRecoveryStart([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  log.debug("onRecoveryStart", details);
  const data = details.requestBody?.formData as unknown as RecoveryStartFormData;
  const dock = data.api_ndock_id[0];
  // 高速修復材を同時使用した入渠は即完了するため、タイマーは積まない。
  // 同じドックに古いQueueが残っていた場合に備えて掃除だけ行う（onRecoveryHighspeedと同じ扱い）。
  if (data.api_highspeed[0] === "1") {
    await Queue.deleteSlot(EntryType.RECOVERY, dock);
    return;
  }
  const tab = await new TabService().get(details.tabId);
  const raw = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "jpeg" });
  const img = await WorkerImage.from(raw);
  const url = await (new CropService(img)).crop(EntryType.RECOVERY);
  await chrome.tabs.sendMessage(details.tabId, {
    __action__: "/injected/dmm/ocr",
    url, purpose: EntryType.RECOVERY,
    [EntryType.RECOVERY]: { dock }
  });
}

// 修復中に高速修復剤を使って完了させたとき、そのドックの修復Queueと表示中の修復通知を消す。
// この経路では完了通知が出ない（QueueWatcherを通らない）ため、開始通知の掃除もここで行う。
export async function onRecoveryHighspeed([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const { api_ndock_id: [dock] } = details.requestBody?.formData as unknown as RecoverySpeedchangeFormData;
  await Queue.deleteSlot(EntryType.RECOVERY, dock);
  await clearNotificationsOf(EntryType.RECOVERY, dock);
}

// 出撃開始時
export async function onMapStart([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const data = details.requestBody?.formData as unknown as MapStartFormData;
  const deck = data.api_deck_id[0];
  const map = { area: data.api_maparea_id[0], info: data.api_mapinfo_no[0] };
  const fatigue = new Fatigue(parseInt(deck), map);
  Logbook.sortie.start(deck, map);
  // 出撃した艦隊の表示中の疲労回復通知を消す（疲労通知はENDでのみ発行される）
  await NotificationService.new().clear(fatigue.$n.id(TriggerType.END));
  // 設定が有効な場合のみ、同じ艦隊の既存の疲労Queueを削除して最新の1本に積み直す。
  // 既定では削除せず出撃ごとにタイマーが並ぶ（連続出撃の回数把握に使える）。
  const behavior = await BehaviorConfig.user();
  if (behavior.restackFatigueOnSortie) {
    await Queue.deleteSlot(EntryType.FATIGUE, fatigue.deck);
  }
  await Queue.create({ type: EntryType.FATIGUE, params: fatigue, scheduled: Date.now() + fatigue.time });
}

// マップ移動時
export async function onMapNext([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  log.debug("onMapNext", details);
  const data = details.requestBody?.formData as {
    api_cell_id: string[]; // たぶんここにマスIDが入ってる
  };
  if (!data?.api_cell_id) return log.warn("onMapNext: api_cell_id not found", details);
  Logbook.sortie.next(data.api_cell_id[0]);
}

// 戦闘（昼戦）開始時
export async function onBattleStarted([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  await clearSnapshotOnBattleStart(details);
  const data = details.requestBody?.formData as {
    api_formation: string[]; // 陣形
    api_recovery_type: string[]; // なんだこれ
  };
  Logbook.sortie.battle.start(data.api_formation[0]);
}

// 連合艦隊戦（昼戦）開始時。通常艦隊の onBattleStarted と同様に連戦数をカウントする（#1764）。
// 連合艦隊では api_req_combined_battle/battle が飛ぶが従来ハンドラが無く連戦数が積まれなかった。
// formData の形は実データ未観測のため api_formation を防御的に読む（揺らぎは許容）。
export async function onCombinedBattleStarted([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  await clearSnapshotOnBattleStart(details);
  const data = details.requestBody?.formData as { api_formation?: string[] } | undefined;
  Logbook.sortie.battle.start(data?.api_formation?.[0] ?? "");
}

// 夜戦（昼戦マスからの追撃夜戦）突入時。同じマスの戦闘の継続なので連戦数は増やさず、
// 最後の戦闘に夜戦フラグだけ立てる。開幕夜戦マス（sp_midnight）とは区別する（#1764）。
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function onMidnightBattleStarted([_details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  Logbook.sortie.battle.midnight();
}

// 夜戦突入（開幕夜戦）マスの戦闘開始時。昼戦を経ず api_req_battle_midnight/sp_midnight が飛ぶ
// 新規マスの戦闘なので、連戦数に算入(push)してから夜戦フラグを立てる（#1764）。戦闘結果は
// api_req_sortie/battleresult 側で返るため、大破進撃防止窓は既存の onComplete 経路で表示される。
// 未ハンドルだと remove も push も起きず「前マスの窓が残り横並び増殖」「連戦数の数え漏れ」を招いていた。
export async function onSpMidnightBattleStarted([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  await clearSnapshotOnBattleStart(details);
  const data = details.requestBody?.formData as { api_formation?: string[] } | undefined;
  Logbook.sortie.battle.start(data?.api_formation?.[0] ?? "");
  Logbook.sortie.battle.midnight();
}

// 連合艦隊の開幕夜戦マス。api パス・formData 形ともに未観測（イベント期間外で実データ取得不可）の
// ため予防的に用意し、通常版 sp_midnight と対にして連戦数漏れを防ぐ。実機で観測できたらパス名と
// formData の形を確定すること（#1764）。
export async function onCombinedSpMidnightBattleStarted([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  await clearSnapshotOnBattleStart(details);
  const data = details.requestBody?.formData as { api_formation?: string[] } | undefined;
  Logbook.sortie.battle.start(data?.api_formation?.[0] ?? "");
  Logbook.sortie.battle.midnight();
}

// 戦闘終了時
export async function onBattleResulted([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  log.debug("onBattleResulted", details);
  Logbook.sortie.battle.result();
}

// 建造した艦を受け取ったとき、そのドックの建造通知（開始・完了）を消す
export async function onGetShip([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const { api_kdock_id: [dock] } = details.requestBody?.formData as unknown as GetShipFormData;
  await clearNotificationsOf(EntryType.SHIPBUILD, dock);
}

export async function onCreateShip([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const data = details.requestBody?.formData as unknown as CreateShipFormData; 
  const dock = data.api_kdock_id[0];
  // 高速建造材を同時使用した建造は即完了するため、タイマーは積まない。
  // api_get_member/kdock 経由でも呼ばれ、その場合 api_highspeed は無いので防御的に見る。
  if (data.api_highspeed?.[0] === "1") {
    await Queue.deleteSlot(EntryType.SHIPBUILD, dock);
    return;
  }
  const tab = await new TabService().get(details.tabId);
  await sleep(600); // いったんめんどくさいんでこれで
  const raw = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "jpeg" });
  const img = await WorkerImage.from(raw);
  const url = await (new CropService(img)).crop(EntryType.SHIPBUILD, { dock });
  await chrome.tabs.sendMessage(details.tabId, {
    __action__: "/injected/dmm/ocr",
    url, purpose: EntryType.SHIPBUILD,
    [EntryType.SHIPBUILD]: { dock }
  });
}

// 建造中に高速建造材を使って完了させたとき、そのドックの建造Queueを削除する
export async function onShipbuildHighspeed([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const { api_kdock_id: [dock] } = details.requestBody?.formData as unknown as ShipbuildSpeedchangeFormData;
  await Queue.deleteSlot(EntryType.SHIPBUILD, dock);
}
