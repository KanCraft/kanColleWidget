import { Router } from "chomex";
import { OnUpdateAvailable } from "../Controllers/Runtime";

const onUpdateAvailable = new Router(() => ({ name: "*" }));
onUpdateAvailable.on("*", OnUpdateAvailable);
export const OnUpdateAvailableListener = onUpdateAvailable.listener();
