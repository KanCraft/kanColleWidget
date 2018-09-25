import CaptureService from "../../../../Services/Capture";
import Rectangle from "../../../../Services/Rectangle";
import TrimService from "../../../../Services/Trim";
import WindowService from "../../../../Services/Window";
import { sleep } from "../../../../utils";
import Recovery from "../../../Models/Queue/Recovery";

const tmp = {
  dock: null,
};

// TODO: 必要があればd.tsにしてdefinitionsに持っていく
declare interface DebuggableResponse extends chrome.webRequest.WebResponseCacheDetails {
  debug?: any;
}

export async function OnRecoveryStart(req: chrome.webRequest.WebRequestBodyDetails) {
  const { formData: { api_ndock_id: [dock], api_highspeed: [highspeed] } } = req.requestBody;
  tmp.dock = highspeed === "1" ? null : parseInt(dock, 10);
}

export async function OnRecoveryStartCompleted(req: DebuggableResponse) {

  if (req.debug) {
    tmp.dock = req.debug.dock;
  }

  const recovery = Recovery.for(tmp.dock);
  tmp.dock = null;

  const ws = WindowService.getInstance();
  const cs = new CaptureService();
  await sleep(850);
  const tab = await ws.find(true);
  const uri = await cs.base64(tab.windowId, {});
  // console.log(uri);
  const ts = await TrimService.init(uri);
  const rect = Rectangle.new(ts.img.width, ts.img.height).recovery(recovery.dock as number);
  const img = ts.trim(rect);
  // console.log(img);
  // console.log(recovery);
}
