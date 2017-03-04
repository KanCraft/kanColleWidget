import {Sync} from "../../Models";

export function SyncSave(message) {
  const sync = new Sync(chrome.storage.sync);
  return sync.save(message.keys, true);
}
export function SyncLoad(message) {
  const sync = new Sync(chrome.storage.sync);
  return sync.load(message.keys, true);
}
