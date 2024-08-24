import { Router } from "chromite";
import { Launcher } from "../services/Launcher";
import { Frame } from "../models/Frame";

const onClicked = new Router<chrome.notifications.NotificationClickedEvent>(async (id) => {
  return { __action__: id };
});

onClicked.onNotFound(async () => {
  const launcher = new Launcher();
  const frame = await Frame.memory();
  launcher.launch(frame);
})

export {
  onClicked,
}