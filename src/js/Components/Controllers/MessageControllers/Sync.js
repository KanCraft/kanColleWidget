import {Sync} from "../../Models";
import Config from "../../Models/Config";

export function SyncSave(message) {
  const keys = message.keys || (Config.find("data-sync-autosave").value ? Config.find("data-sync").keys : []);
  const sync = new Sync(chrome.storage.sync);
  return sync.save(keys, true);
}
export function SyncLoad(message) {
  const sync = new Sync(chrome.storage.sync);
  return sync.load(message.keys, true);
}
