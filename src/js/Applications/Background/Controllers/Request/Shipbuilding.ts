import CaptureService from "../../../../Services/Capture";
import Rectangle from "../../../../Services/Rectangle";
import TrimService from "../../../../Services/Trim";
import WindowService from "../../../../Services/Window";
import { sleep } from "../../../../utils";
import Shipbuilding from "../../../Models/Queue/Shipbuilding";
import { DebuggableRequest, DebuggableResponse } from "../../../../definitions/debuggable";
import NotificationService from "../../../../Services/Notification";
import OCRService from "../../../../Services/OCR";
import NotificationSetting from "../../../Models/Settings/NotificationSetting";
import DebugSetting from "../../../Models/Settings/DebugSetting";
import TempStorage from "../../../../Services/TempStorage";

const tmp = {
  dock: null,
};

export async function OnShipbuildingStart(req: DebuggableRequest) {
  const { formData: { api_kdock_id: [dock], api_highspeed: [highspeed] } } = req.requestBody;
  tmp.dock = highspeed === "1" ? null : parseInt(dock, 10);
  return { status: 200 };
}

/**
 * 建造済みを回収
 */
export async function OnShipbuildingGetShip() {
  const service = new NotificationService();
  const notes = await service.getAll();
  Object.entries(notes).map(async ([nid]) => {
    if (nid.startsWith(Shipbuilding.__ns)) await service.clear(nid);
  });
}

/**
 * @MESSAGE /api_req_kousyou/createship_speedchange
 * 建造途中で高速剤使ったときの処理
 */
export async function OnShipbuildingHighspeed(req: DebuggableRequest) {
  const { formData: { api_kdock_id: [dock] } } = req.requestBody;
  return Shipbuilding.filter<Shipbuilding>(r => r.dock == dock).map(r => r.delete());
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

  const ocr = new OCRService(DebugSetting.user().ocrServerUrl);
  const { text, time } = await ocr.fromBase64(base64);

  const shipbuilding = Shipbuilding.new<Shipbuilding>({dock, time, text});
  shipbuilding.register(Date.now() + time);

  if (DebugSetting.user().on) {
    const key = await TempStorage.new().store(`debug_${Date.now()}`, base64);
    ws.openCapturePage({ key, info: JSON.stringify(shipbuilding) });
  }

  const setting = NotificationSetting.find<NotificationSetting>(shipbuilding.kind());
  if (!setting.enabled) return { status: 202, shipbuilding };

  const notifications = new NotificationService();
  const nid = shipbuilding.toNotificationID({start: true});
  notifications.create(nid, setting.getChromeOptions(shipbuilding, false));

  return { status: 202, shipbuilding };
}
