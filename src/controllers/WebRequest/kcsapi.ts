import { Logger } from "../../logger";
import { missions } from "../../catalog";
import { sleep, WorkerImage } from "../../utils";
import Queue from "../../models/Queue";
import { BattleStartFormData, CreateShipFormData, GetShipFormData, MapNextFormData, MapStartFormData, MissionResultFormData, MissionStartFormData, RecoveryStartFormData, RecoverySpeedchangeFormData, ShipbuildSpeedchangeFormData } from "./datatypes";
import { formData } from "./formdata";
import { EntryType, Fatigue, Mission } from "../../models/entry";
import { TriggerType } from "../../models/entry";
import { TabService } from "../../services/TabService";
import { CropService } from "../../services/CropService";
import { NotificationService } from "../../services/NotificationService";
import { Launcher } from "../../services/Launcher";
import { Logbook } from "../../models/Logbook";
import { DamageSnapshotConfig } from "../../models/configs/DamageSnapshotConfig";
import { BehaviorConfig } from "../../models/configs/BehaviorConfig";
import { Routes } from "../../messages";
import type { Route, DmmOcrPayload } from "../../messages";

const log = Logger.get("WebRequest");

// 大破進撃防止窓を「戦闘開始時に」消す。ただしユーザ設定 keepUntilNextShow が有効なら消さず、
// 次のスナップショット表示時(osapi.show)の差し替えに前の窓の除去を委ねる（前の窓を粘らせる）。
// 母港帰投(onPort)は設定に関わらず常に消すので、この関数は戦闘開始系ハンドラだけで使う。
async function clearSnapshotOnBattleStart(details: chrome.webRequest.OnBeforeRequestDetails) {
  const config = await DamageSnapshotConfig.user();
  if (config.keepUntilNextShow) return;
  chrome.tabs.sendMessage(details.tabId, { __action__: Routes.DSNAPSHOT_REMOVE }, { frameId: details.frameId });
}

export async function onPort([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  chrome.tabs.sendMessage(details.tabId, { __action__: Routes.DSNAPSHOT_REMOVE }, { frameId: details.frameId });
  const dsnapshot = await new Launcher().getDsnapshotTab();
  if (dsnapshot) chrome.windows.remove(dsnapshot.windowId!);
  await Logbook.record();
}

export async function onMissionStart([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const data = formData<MissionStartFormData>(details);
  if (!data) return;
  const did = data.api_deck_id[0];
  const mid = data.api_mission_id[0];
  const spec = missions[mid];
  // カタログ未収録の遠征は所要時間が不明で終了時刻を算出できないため、タイマーを積まない
  if (!spec) {
    log.warn("onMissionStart: カタログ未収録の遠征ID", mid);
    return;
  }
  const m = new Mission(did, mid, spec);
  // 遠征は残り1分を切ると母港復帰で即完了する仕様のため、通知を一律で1分早める（#1811, Mission.EARLY_RETURN_MARGIN）。
  // 入渠・建造はOCRで実時刻を読むためこの補正は不要。
  const scheduled = Date.now() + Math.max(0, m.time - Mission.EARLY_RETURN_MARGIN);
  // 同じ艦隊の既存Queueを削除してから積み直す（他端末での帰投操作等、検知できない経路で
  // 古いQueueが残っていても、同じ艦隊で次の遠征を始めた時点で解消される）。
  const q = await Queue.restack(EntryType.MISSION, did, m, scheduled);
  const e = q.entry();
  NotificationService.new().notify(e, TriggerType.START);
}

export async function onMissionReturnInstruction([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  log.debug("onMissionReturnInstruction", details);
}

// スロット（艦隊/ドック）のタイマーの生涯を終える: 未発火の Queue と表示中の通知を両方消す。
// 回収・即完了などスロットの用事が済んだハンドラは必ずこれを呼ぶこと。片方だけ消すと、
// 通知表示前の回収では後から完了通知が出て残り続け（#1844）、即完了経路（QueueWatcher を
// 通らず完了通知が出ない）では開始通知に自動で消える機会がなくなる。
// 通知表示後の回収では QueueWatcher が Queue を削除済みなので、通知の掃除だけが効く。
async function retireSlot(type: EntryType, slot: string) {
  await Queue.deleteSlot(type, slot);
  await NotificationService.new().clearBy({ type, target: slot });
}

// 遠征結果を回収したとき、その艦隊の遠征タイマー（Queue・通知）を終える（#1844）
export async function onMissionResult([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const data = formData<MissionResultFormData>(details);
  if (!data) return;
  const deck = data.api_deck_id[0];
  await retireSlot(EntryType.MISSION, deck);
}

// 現在のゲーム画面をキャプチャし、対象領域を切り出して content script に OCR を依頼する
async function requestOcr<P extends EntryType.RECOVERY | EntryType.SHIPBUILD>(details: chrome.webRequest.OnBeforeRequestDetails, type: P, dock: string): Promise<void> {
  const tabs = new TabService();
  const tab = await tabs.get(details.tabId);
  const raw = await tabs.capture(tab.windowId, { format: "jpeg" });
  const img = await WorkerImage.from(raw);
  const url = await (new CropService(img)).crop(type, { dock });
  const payload = {
    __action__: Routes.DMM_OCR,
    url, purpose: type,
    [type]: { dock },
  } as { __action__: Route<"DMM_OCR"> } & DmmOcrPayload<P>;
  await chrome.tabs.sendMessage(details.tabId, payload);
}

export async function onRecoveryStart([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  log.debug("onRecoveryStart", details);
  const data = formData<RecoveryStartFormData>(details);
  if (!data) return;
  const dock = data.api_ndock_id[0];
  // 高速修復材を同時使用した入渠は即完了するため、タイマーは積まない。
  // 同じドックに古いQueueが残っていた場合に備えて掃除だけ行う（onRecoveryHighspeedと同じ扱い）。
  if (data.api_highspeed[0] === "1") {
    await Queue.deleteSlot(EntryType.RECOVERY, dock);
    return;
  }
  await requestOcr(details, EntryType.RECOVERY, dock);
}

// 修復中に高速修復剤を使って完了させたとき、そのドックの修復タイマー（Queue・通知）を終える
export async function onRecoveryHighspeed([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const data = formData<RecoverySpeedchangeFormData>(details);
  if (!data) return;
  const dock = data.api_ndock_id[0];
  await retireSlot(EntryType.RECOVERY, dock);
}

// 出撃開始時
export async function onMapStart([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const data = formData<MapStartFormData>(details);
  if (!data) return;
  const deck = data.api_deck_id[0];
  const map = { area: data.api_maparea_id[0], info: data.api_mapinfo_no[0] };
  const fatigue = new Fatigue(parseInt(deck), map);
  Logbook.sortie.start(deck, map);
  // 出撃した艦隊の表示中の疲労回復通知を消す（疲労通知はENDでのみ発行される）
  await NotificationService.new().clear(fatigue.$n.id(TriggerType.END));
  // 設定が有効な場合のみ、同じ艦隊の既存の疲労Queueを削除して最新の1本に積み直す。
  // 既定では削除せず出撃ごとにタイマーが並ぶ（連続出撃の回数把握に使える）。
  const behavior = await BehaviorConfig.user();
  const scheduled = Date.now() + fatigue.time;
  if (behavior.restackFatigueOnSortie) {
    await Queue.restack(EntryType.FATIGUE, fatigue.deck, fatigue, scheduled);
  } else {
    await Queue.create({ type: EntryType.FATIGUE, params: fatigue, scheduled });
  }
}

// マップ移動時
export async function onMapNext([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  log.debug("onMapNext", details);
  const data = formData<MapNextFormData>(details);
  if (!data?.api_cell_id) return log.warn("onMapNext: api_cell_id not found", details);
  Logbook.sortie.next(data.api_cell_id[0]);
}

// 戦闘開始系ハンドラの共通処理。大破進撃防止窓の除去と Logbook への連戦記録を行い、
// midnight 指定時は開幕夜戦として夜戦フラグも立てる。api_formation は欠落時
// 空文字で記録する（欠落してもマス数のカウントは落とさない）。
async function startBattle(details: chrome.webRequest.OnBeforeRequestDetails, { midnight = false } = {}) {
  await clearSnapshotOnBattleStart(details);
  const data = formData<BattleStartFormData>(details);
  Logbook.sortie.battle.start(data?.api_formation?.[0] ?? "");
  if (midnight) Logbook.sortie.battle.midnight();
}

// 戦闘（昼戦）開始時
export async function onBattleStarted([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  await startBattle(details);
}

// 連合艦隊戦（昼戦）開始時。通常艦隊の onBattleStarted と同様に連戦数をカウントする（#1764）。
// 連合艦隊では api_req_combined_battle/battle が飛ぶが従来ハンドラが無く連戦数が積まれなかった。
// formData の形は実データ未観測のため api_formation を防御的に読む（揺らぎは許容）。
export async function onCombinedBattleStarted([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  await startBattle(details);
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
  await startBattle(details, { midnight: true });
}

// 連合艦隊の開幕夜戦マス。api パス・formData 形ともに未観測（イベント期間外で実データ取得不可）の
// ため予防的に用意し、通常版 sp_midnight と対にして連戦数漏れを防ぐ。実機で観測できたらパス名と
// formData の形を確定すること（#1764）。
export async function onCombinedSpMidnightBattleStarted([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  await startBattle(details, { midnight: true });
}

// 航空戦マス（1-6等）・空襲戦マス（通常/連合艦隊、7-5・5-2・E1等）・イベント海域の基地航空戦の
// 戦闘開始時。昼戦と同じく連戦数に算入する。夜戦に継続するマスではないため midnight は立てない（#1854）。
export async function onAirBattleStarted([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  await startBattle(details);
}

// 戦闘終了時
export async function onBattleResulted([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  log.debug("onBattleResulted", details);
  Logbook.sortie.battle.result();
}

// 建造した艦を受け取ったとき、そのドックの建造タイマー（Queue・通知）を終える（#1844）
export async function onGetShip([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const data = formData<GetShipFormData>(details);
  if (!data) return;
  const dock = data.api_kdock_id[0];
  await retireSlot(EntryType.SHIPBUILD, dock);
}

export async function onCreateShip([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const data = formData<CreateShipFormData>(details);
  if (!data) return;
  const dock = data.api_kdock_id[0];
  // このハンドラは [createship, kdock] のシーケンスマッチで発火し、details には先頭の
  // createship リクエスト（建造開始の formData）が渡される。
  // 高速建造材を同時使用した建造は即完了するため、タイマーは積まない。
  if (data.api_highspeed[0] === "1") {
    await Queue.deleteSlot(EntryType.SHIPBUILD, dock);
    return;
  }
  await sleep(600); // いったんめんどくさいんでこれで
  await requestOcr(details, EntryType.SHIPBUILD, dock);
}

// 建造中に高速建造材を使って完了させたとき、そのドックの建造タイマー（Queue・通知）を終える。
// 従来は Queue 削除のみで、修復側（onRecoveryHighspeed）と非対称に開始通知が残り得た
export async function onShipbuildHighspeed([details]: chrome.webRequest.OnBeforeRequestDetails[]) {
  const data = formData<ShipbuildSpeedchangeFormData>(details);
  if (!data) return;
  const dock = data.api_kdock_id[0];
  await retireSlot(EntryType.SHIPBUILD, dock);
}
