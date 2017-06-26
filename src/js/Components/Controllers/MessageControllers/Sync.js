import {Sync} from "../../Models";
import Config from "../../Models/Config";

import NotificationService from "../../Services/NotificationService";
import Assets from "../../Services/Assets";

export function SyncSave(message) {
  const keys = message.keys || (Config.find("data-sync-autosave").value ? Config.find("data-sync").keys : []);
  const sync = new Sync(chrome.storage.sync);
  const notes = new NotificationService();
  const assets = new Assets();
  return sync.save(keys, true).then(items => {
    notes.create("data-sync-load-done", {
      type:    "list",
      iconUrl: assets.getSyncIcon("save"),
      title: "[艦これウィジェット] SAVE",
      // https://bugs.chromium.org/p/chromium/issues/detail?id=384025
      message: "以下の同期データをセーブしました",
      items: keys.map(key => ({title: "✔", message: key})),
    });
    return Promise.resolve(items);
  });
}

export function SyncLoad(message = {}) {
  if (message.context == "auto" && !Config.find("data-sync-autoload").value) return {status:200};
  const keys = message.keys || Config.find("data-sync").keys;
  if (keys.length == 0) return {status:200};
  const sync = new Sync(chrome.storage.sync);
  const notes = new NotificationService();
  const assets = new Assets();
  return sync.load(keys, true).then(items => {
    notes.create("data-sync-load-done", {
      type:    "list",
      iconUrl: assets.getSyncIcon("load"),
      title: "[艦これウィジェット] LOAD",
      // https://bugs.chromium.org/p/chromium/issues/detail?id=384025
      message: "以下の同期データをロードしました",
      items: keys.map(key => ({title: "✔", message: key})),
    });
    return Promise.resolve(items);
  });
}
