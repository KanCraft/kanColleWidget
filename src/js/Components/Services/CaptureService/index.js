// TODO: ここはimportじゃなくてコンストラクタ引数にしたいぞい
import Config from "../../Models/Config";

export default class CaptureService {
  constructor(mod = chrome) {
    this.module = mod;
  }

  capture(windowId) {
    if (typeof windowId == "object") {
      windowId = windowId.id;
    }
    return new Promise(resolve => {
      let format = Config.find("download-file-ext").value;
      let quality = 100;
      this.module.tabs.captureVisibleTab(windowId, {format, quality}, resolve);
    });
  }
}
