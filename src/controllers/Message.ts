import { Router } from "chromite";
import { Frame } from "../models/Frame";

const onMessage = new Router<chrome.runtime.ExtensionMessageEvent>();

onMessage.on("/frame/memory:track", async (req) => {
  const frame = await Frame.memory();
  return await frame.update({ position: req.position, size: req.size });
});

export { onMessage };