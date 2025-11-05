import { Logger } from "chromite";
import { missions } from "../../catalog";
import { sleep, WorkerImage } from "../../utils";
import Queue from "../../models/Queue";
import { CreateShipFormData, MapStartFormData, MissionStartFormData, RecoveryStartFormData } from "./datatypes";
import { EntryType, Fatigue, Mission } from "../../models/entry";
import { TriggerType } from "../../models/entry";
import { TabService } from "../../services/TabService";
import { CropService } from "../../services/CropService";
import { NotificationService } from "../../services/NotificationService";
import { Launcher } from "../../services/Launcher";

const log = new Logger("WebRequest");

export async function onPort([details]: chrome.webRequest.WebRequestBodyDetails[]) {
  chrome.tabs.sendMessage(details.tabId, { __action__: "/injected/kcs/dsnapshot:remove" }, { frameId: details.frameId });
  const dsnapshot = await new Launcher().getDsnapshotTab();
  if (dsnapshot) chrome.windows.remove(dsnapshot.windowId!);
}

export async function onMissionStart([details]: chrome.webRequest.WebRequestBodyDetails[]) {
  const data: MissionStartFormData = details.requestBody?.formData as unknown as MissionStartFormData;
  const did = data.api_deck_id[0];
  const mid = data.api_mission_id[0];
  const m = new Mission(did, mid, missions[mid]);
  const q = await Queue.create({ type: EntryType.MISSION, params: m, scheduled: Date.now() + m.time });
  const e = q.entry();
  NotificationService.new().notify(e, TriggerType.START);
}

export async function onMissionReturnInstruction([details]: chrome.webRequest.WebRequestBodyDetails[]) {
  log.info("onMissionReturnInstruction", details);
}

export async function onMissionResult([details]: chrome.webRequest.WebRequestBodyDetails[]) {
  const { api_deck_id: [api_deck_id] } = details.requestBody?.formData as unknown as { api_deck_id: string[], api_mission_id: string[] };
  // TODO: @types/chrome の chrome.notifications.getAll が Promise を返すようになったら修正
  await chrome.notifications.getAll((notifications) => {
    for (const id in notifications) {
      if (id.match(`/${EntryType.MISSION}/${api_deck_id}`)) chrome.notifications.clear(id);
    }
  });
}

export async function onRecoveryStart([details]: chrome.webRequest.WebRequestBodyDetails[]) {
  log.info("onRecoveryStart", details);
  const data = details.requestBody?.formData as unknown as RecoveryStartFormData;
  const dock = data.api_ndock_id[0];
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

export async function onMapStart([details]: chrome.webRequest.WebRequestBodyDetails[]) {
  const data = details.requestBody?.formData as unknown as MapStartFormData;
  const deck = data.api_deck_id[0];
  const map = { area: data.api_maparea_id[0], info: data.api_mapinfo_no[0] };
  const fatigue = new Fatigue(parseInt(deck), map);
  await Queue.create({ type: EntryType.FATIGUE, params: fatigue, scheduled: Date.now() + fatigue.time });
}

export async function onBattleStarted([details]: chrome.webRequest.WebRequestBodyDetails[]) {
  chrome.tabs.sendMessage(details.tabId, { __action__: "/injected/kcs/dsnapshot:remove" }, { frameId: details.frameId });
}

export async function onCreateShip([details]: chrome.webRequest.WebRequestBodyDetails[]) {
  const data = details.requestBody?.formData as unknown as CreateShipFormData; 
  const dock = data.api_kdock_id[0];
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