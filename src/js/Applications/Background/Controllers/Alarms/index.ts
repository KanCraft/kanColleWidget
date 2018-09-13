import {Client} from "chomex";
import WindowService from "../../../../Services/Window";
import { sleep } from "../../../../utils";

export async function Screenshot(alarm: any) {
  const params = alarm.params as URLSearchParams;
  const uri = decodeURIComponent(params.get("uri"));
  const ws = WindowService.getInstance();
  const page = await ws.capturePage();
  await sleep(800);
  Client.for(chrome.tabs, page.id, false).message("/capture/show", {uri});
  // window.open("/dest/html/capture.html");
}
