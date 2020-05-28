import CaptureService from "../../../../Services/Capture";
import NotificationService from "../../../../Services/Notification";
import Rectangle from "../../../../Services/Rectangle";
import TrimService from "../../../../Services/Trim";
import WindowService from "../../../../Services/Window";
import { sleep } from "../../../../utils";
import Config from "../../../Models/Config";
import Recovery from "../../../Models/Queue/Recovery";
import {
  DebuggableRequest,
  DebuggableResponse,
} from "../../../../definitions/debuggable";
import OCRService from "../../../../Services/OCR";

const tmp = {
  dock: null,
};

export async function OnRecoveryStart(req: DebuggableRequest) {
  const { formData: { api_ndock_id: [dock], api_highspeed: [highspeed] } } = req.requestBody;
  tmp.dock = highspeed === "1" ? null : parseInt(dock, 10);
  return {status: 200};
}

export async function OnRecoveryStartCompleted(req: DebuggableResponse) {

  if (req.debug) {
    tmp.dock = req.debug.dock;
  }
  if (tmp.dock === null) {
    return { status: 200 };
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

  const ocr = new OCRService();
  const {text, time} = await ocr.fromBase64(base64);

  const recovery = Recovery.new<Recovery>({dock, time, text});
  recovery.register(Date.now() + time);

  const notify = Config.find<Config<boolean>>("notification-recovery").value;
  if (notify) {
    const notifications = new NotificationService();
    const nid = recovery.toNotificationID();
    await notifications.create(nid, recovery.notificationOptionOnRegister());
  }

  return { status: 202, recovery };
}
