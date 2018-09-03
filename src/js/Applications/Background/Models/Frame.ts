import {Model} from "chomex";
import Const from "../../../Constants";

export default class Frame extends Model {

  public static default = {
    classic: {
      addressbar: false,
      alias: "CLASSIC",
      description: "1期の大きさ",
      id: "classic",
      position: {left: 40, top: 40},
      selectedAt: 3,
      size: {width: 800, height: 480},
      url: Const.KanColleURL,
      zoom: 2 / 3,
    },
    original: {
      addressbar: false,
      alias: "ORIGINAL",
      description: "公式の大きさ",
      id: "original",
      position: {left: 40, top: 40},
      selectedAt: 2,
      size: {width: 1200, height: 720},
      url: Const.KanColleURL,
      zoom: 1,
    },
    small: {
      addressbar: false,
      alias: "SMALL",
      description: "公式の半分",
      id: "small",
      position: { left: 40, top: 40 },
      protected: true,
      selectedAt: 1,
      size: { width: 600, height: 360 },
      url: Const.KanColleURL,
      zoom: 1 / 2,
    },
  };

  /**
   * 直近、選択された窓を返す
   */
  public static latest(): Frame {
    return super.list<Frame>().sort((prev, next) => prev.selectedAt < next.selectedAt ? -1 : 1).pop();
  }

  public zoom: number;
  public selectedAt: number; // 最後にこの窓が選択されたタイムスタンプ
  private addressbar: boolean;
  private url: string;
  private position: {
    left: number;
    top: number;
  };
  private size: {
    width: number,
    height: number,
  };

  public createData(): chrome.windows.CreateData {
    return {
      type: this.addressbar ? "normal" : "popup",
      url: this.url,
      ...this.size,
      ...this.position,
    };
  }
}
