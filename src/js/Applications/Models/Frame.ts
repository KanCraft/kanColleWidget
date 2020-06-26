import {Model} from "chomex";
import Const from "../../Constants";

export default class Frame extends Model {

  static __ns = "Frame";

  static default = {
    classic: {
      addressbar: false,
      alias: "CLASSIC",
      description: "1期の大きさ",
      id: "classic",
      muted: false,
      position: {left: 40, top: 40},
      selectedAt: 3,
      size: { width: Const.GameWidth * (2 / 3), height: Const.GameHeight * (2 / 3) },
      url: Const.KanColleURL,
      zoom: 2 / 3,
    },
    original: {
      addressbar: false,
      alias: "ORIGINAL",
      description: "公式の大きさ",
      id: "original",
      muted: false,
      position: {left: 40, top: 40},
      selectedAt: 2,
      size: {width: Const.GameWidth, height: Const.GameHeight},
      url: Const.KanColleURL,
      zoom: 1,
    },
    small: {
      addressbar: false,
      alias: "SMALL",
      description: "公式の半分",
      id: "small",
      muted: false,
      position: { left: 40, top: 40 },
      protected: true,
      selectedAt: 1,
      size: { width: Const.GameWidth * (1 / 2), height: Const.GameHeight * (1 / 2) },
      url: Const.KanColleURL,
      zoom: 1 / 2,
    },
    mini: {
      addressbar: false,
      alias: "MINI",
      description: "公式の1/4",
      id: "mini",
      muted: false,
      position: { left: 40, top: 40 },
      protected: true,
      selectedAt: 1,
      size: { width: Const.GameWidth * (1 / 4), height: Const.GameHeight * (1 / 4) },
      url: Const.KanColleURL,
      zoom: 1 / 4,
    }
  };

  /**
   * 直近、選択された窓を返す
   */
  static latest(): Frame {
    return super.list<Frame>().sort((prev, next) => prev.selectedAt < next.selectedAt ? -1 : 1).pop();
  }

  id: string;
  alias: string;

  zoom: number;
  selectedAt: number; // 最後にこの窓が選択されたタイムスタンプ
  muted: boolean;

  private addressbar: boolean;
  private url: string;
  private position: {
    left: number;
    top: number;
  };
  private size: {
    width: number;
    height: number;
  };

  createData(): chrome.windows.CreateData {
    return {
      type: this.addressbar ? "normal" : "popup",
      url: this.url,
      ...this.size,
      ...this.position,
    };
  }
}
