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

  const dock = tmp.dock;
  tmp.dock = null;

  const ws = WindowService.getInstance();
  const cs = new CaptureService();
  await sleep(850);
  const tab = await ws.find(true);
  const uri = await cs.base64(tab.windowId, {});
  const ts = await TrimService.init(uri);
  const rect = Rectangle.new(ts.img.width, ts.img.height).recovery(dock);
  const base64 = ts.trim(rect);

  // {{{ TODO: こういうのここに置いといちゃだめでしょ
  const res = await fetch("https://api-kcwidget.herokuapp.com/ocr/base64", {
    body: JSON.stringify({ base64, whitelist: "0123456789:" }),
    method: "POST",
  });
  const {result: text} = await res.json();
  const [h, m, s] = text.trim().split(":").map(p => parseInt(p, 10));
  const time = (h * (60 * 60) + m * (60) + s) * 1000;
  // }}}

  const recovery = Recovery.new<Recovery>({dock, time, text});
  recovery.register(Date.now() + time);
}
