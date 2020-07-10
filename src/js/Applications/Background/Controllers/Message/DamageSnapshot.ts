import {Client} from "chomex";
import CaptureService from "../../../../Services/Capture";
import Rectangle from "../../../../Services/Rectangle";
import TempStorage from "../../../../Services/TempStorage";
import TrimService from "../../../../Services/Trim";
import WindowService from "../../../../Services/Window";
import { sleep } from "../../../../utils";
import Config from "../../../Models/Config";
import DamageSnapshotSetting, { DamageSnapshotType } from "../../../Models/Settings/DamageSnapshotSetting";

export async function DamageSnapshotCapture(message: {after: number; key: string}) {
  const ws = WindowService.getInstance();
  const tab = await ws.find();
  await sleep(message.after || 1000); // 艦隊の描画が止まるのを待つ
  const cs = new CaptureService();
  const original = await cs.base64(tab.windowId, {});
  const ts = await TrimService.init(original);
  const rect = Rectangle.new(ts.img.width, ts.img.height);
  const trimmed = ts.trim(rect.damagesnapshot());

  const key = message.key; // drawする画像を間違えないようにするためのkey
  const setting = DamageSnapshotSetting.user();
  switch (setting.type) {
  case DamageSnapshotType.InApp:
    Client.for(chrome.tabs, tab.id, false).message("/snapshot/show", { uri: trimmed, height: Config.find<Config<number>>("inapp-dsnapshot-size").value });
    break;
  case DamageSnapshotType.Separate:
    (new TempStorage()).store(`damagesnapshot_${key}`, trimmed);
    break;
  }
  return {status: 202, tabId: tab.id};
}

export async function DamageSnapshotRecord(message: any) {
  const { position, size } = message;
  const setting = DamageSnapshotSetting.user();
  setting.update({ frame: { position, size } });
  return { status: 200, frame: setting.frame };
}
