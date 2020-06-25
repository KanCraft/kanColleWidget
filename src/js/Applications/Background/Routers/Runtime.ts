import { Router } from "chomex";
import { RuntimeOnInstalled } from "../Controllers/Runtime";

const installed = new Router((d: chrome.runtime.InstalledDetails) => ({ name: d.reason }));
installed.on("install", RuntimeOnInstalled);
installed.on("update", RuntimeOnInstalled);
export const RuntimeOnInstalledListener = installed.listener();
