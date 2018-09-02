import {Model} from "chomex";
import Const from "../../../Constants";

export default class Frame extends Model {

  public static default = {
    small: {
      addressbar: false,
      alias: "小型",
      // TODO: v3なので消す
      // decoration: "EXTRACT",
      id: "small",
      position: { left: 40, top: 40 },
      protected: true,
      size: { width: 600, height: 360 },
      url: Const.KanColleURL,
      zoom: 0.5,
    },
  };

  public zoom: number;
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
