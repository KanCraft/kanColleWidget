import CaptureService from "../../../../Services/Capture";
import Rectangle from "../../../../Services/Rectangle";
import TrimService from "../../../../Services/Trim";
import WindowService from "../../../../Services/Window";
import { sleep } from "../../../../utils";
import Shipbuilding from "../../../Models/Queue/Shipbuilding";
import {
  DebuggableRequest,
  DebuggableResponse,
} from "../../../../definitions/debuggable";
import Config from "../../../Models/Config";
import NotificationService from "../../../../Services/Notification";
import OCRService from "../../../../Services/OCR";

const tmp = {
  dock: null,
};

export async function OnShipbuildingStart(req: DebuggableRequest) {
  const { formData: { api_kdock_id: [dock], api_highspeed: [highspeed] } } = req.requestBody;
  tmp.dock = highspeed === "1" ? null : parseInt(dock, 10);
  return { status: 200 };
}

export async function OnShipbuildingGetShip(req: DebuggableRequest) {
  const service = new NotificationService();
  const notes = await service.getAll();
  Object.entries(notes).map(async ([nid]) => {
    if (nid.startsWith(Shipbuilding.__ns)) await service.clear(nid);
  });
}

export async function OnShipbuildingStartCompleted(req: DebuggableResponse) {

  if (req.debug) {
    tmp.dock = req.debug.dock;
  }
  if (tmp.dock === null) {
    return { status: 200 };
  }

  const dock = tmp.dock;
  tmp.dock = null;

  await sleep(50);
  const ws = WindowService.getInstance();
  const cs = new CaptureService();
  const tab = await ws.find(true);
  const uri = await cs.base64(tab.windowId, {});
  const ts = await TrimService.init(uri);
  const rect = Rectangle.new(ts.img.width, ts.img.height).shipbuilding(dock);
  const base64 = ts.trim(rect);

  const ocr = new OCRService();
  const { text, time } = await ocr.fromBase64(base64);

  const shipbuilding = Shipbuilding.new<Shipbuilding>({dock, time, text});
  shipbuilding.register(Date.now() + time);

  const notify = Config.find<Config<boolean>>("notification-shipbuilding").value;
  if (notify) {
    const notifications = new NotificationService();
    const nid = shipbuilding.toNotificationID({start: true});
    notifications.create(nid, shipbuilding.notificationOptionOnRegister());
  }

  return { status: 202, shipbuilding };
}
