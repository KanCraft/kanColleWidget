import { Logger } from "chromite";
import { missions } from "../../catalog";
import { sleep } from "../../utils";
import Queue from "../../models/Queue";
import { MissionStartFormData, RecoveryStartFormData } from "./datatypes";
import { EntryType, Mission } from "../../models/entry";
import { TriggerType } from "../../models/entry/Base";
import { TabService } from "../../services/TabService";

const log = new Logger("WebRequest");

export async function onPort(details: chrome.webRequest.WebRequestBodyDetails) {
  log.info("onPort", details);
}

export async function onMissionStart(details: chrome.webRequest.WebRequestBodyDetails) {
  const data: MissionStartFormData = details.requestBody?.formData as unknown as MissionStartFormData;
  const did = data.api_deck_id[0];
  const mid = data.api_mission_id[0];
  const m = new Mission(did, mid, missions[mid]);
  await Queue.create({ type: EntryType.MISSION, params: m, scheduled: Date.now() + m.time });
  await chrome.notifications.create(m.$n.id(TriggerType.START), m.$n.options(TriggerType.START));
  await sleep(6 * 1000);
  await chrome.notifications.clear(m.$n.id(TriggerType.START));
}

export async function onMissionReturnInstruction(details: chrome.webRequest.WebRequestBodyDetails) {
  log.info("onMissionReturnInstruction", details);
}

export async function onMissionResult(details: chrome.webRequest.WebRequestBodyDetails) {
  log.info("onMissionResult", details);
}

export async function onRecoveryStart(details: chrome.webRequest.WebRequestBodyDetails) {
  const data = details.requestBody?.formData as unknown as RecoveryStartFormData;
  const dock = data.api_ndock_id[0];
  const tab = await new TabService().get(details.tabId);
  const url = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "jpeg" });
  await chrome.tabs.sendMessage(details.tabId, {
    __action__: "/injected/dmm/ocr",
    url, purpose: EntryType.RECOVERY,
    [EntryType.RECOVERY]: { dock }
  });
}
