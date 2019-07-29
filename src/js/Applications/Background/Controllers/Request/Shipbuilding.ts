import CaptureService from "../../../../Services/Capture";
import Rectangle from "../../../../Services/Rectangle";
import TrimService from "../../../../Services/Trim";
import WindowService from "../../../../Services/Window";
import { sleep } from "../../../../utils";
import Shipbuilding from "../../../Models/Queue/Shipbuilding";

const tmp = {
    dock: null,
};

export async function OnShipbuildingStart(req: DebuggableRequest) {
    const { formData: { api_kdock_id: [dock], api_highspeed: [highspeed] } } = req.requestBody;
    tmp.dock = highspeed === "1" ? null : parseInt(dock, 10);
    return { status: 200 };
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

    // {{{ TODO: こういうのここに置いといちゃだめでしょ
    const res = await fetch("https://api-kcwidget.herokuapp.com/ocr/base64", {
        body: JSON.stringify({ base64, whitelist: "0123456789:" }),
        method: "POST",
    });
    const {result: text} = await res.json();
    const [h, m, s] = text.trim().split(":").map(p => parseInt(p, 10));
    const time = (h * (60 * 60) + m * (60) + s) * 1000;
    // }}}

    const shipbuilding = Shipbuilding.new<Shipbuilding>({dock, time, text});
    shipbuilding.register(Date.now() + time);

    return { status: 202, shipbuilding };
}
