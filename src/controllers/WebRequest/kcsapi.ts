import { Logger } from "chromite";
import { MissionStartFormData } from "./datatypes";
import { missions } from "../../catalog";
import Queue from "../../models/Queue";
import { EntryType, Mission } from "../../models/entry";

const log = new Logger("WebRequest");

export async function onPort(details: chrome.webRequest.WebRequestBodyDetails) {
  log.info("onPort", details);
}

export async function onMissionStart(details: chrome.webRequest.WebRequestBodyDetails) {
  const data: MissionStartFormData = details.requestBody?.formData as unknown as MissionStartFormData;
  const did = data.api_deck_id[0];
  const mid = data.api_mission_id[0];
  const m = missions[mid];
  const queue = await Queue.create({ type: EntryType.MISSION, params: new Mission(did, mid, m), scheduled: Date.now() + m.time });
  log.info("onMissionStart", m, queue);
}

export async function onMissionReturnInstruction(details: chrome.webRequest.WebRequestBodyDetails) {
  log.info("onMissionReturnInstruction", details);
}

export async function onMissionResult(details: chrome.webRequest.WebRequestBodyDetails) {
  log.info("onMissionResult", details);
}