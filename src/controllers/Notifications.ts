import { Router } from "chromite";
import { Launcher } from "../services/Launcher";
import { Frame } from "../models/Frame";

const onClicked = new Router<typeof chrome.notifications.onClicked>(async (id) => {
  return { __action__: id };
});

onClicked.onNotFound(async (id) => {
  const launcher = new Launcher();
  const frame = await Frame.memory();
  launcher.launch(frame);
  chrome.notifications.clear(id);
})

export {
  onClicked,
}