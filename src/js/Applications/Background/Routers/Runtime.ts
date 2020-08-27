import { Router } from "chomex";
import { OnInstalled, OnUpdateAvailable, OnUpdated } from "../Controllers/Runtime";

const installed = new Router((d: chrome.runtime.InstalledDetails) => ({ name: d.reason }));
installed.on("install", OnInstalled);
installed.on("update", OnUpdated);
export const OnInstalledListener = installed.listener();

const onUpdateAvailable = new Router(() => ({ name: "*" }));
onUpdateAvailable.on("*", OnUpdateAvailable);
export const OnUpdateAvailableListener = onUpdateAvailable.listener();
