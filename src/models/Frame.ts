import { Model } from "jstorm/chrome/local";
import { GameRawWidth, GameRawHeight, KanColleURL } from "../constants";

export interface FrameParams {
    addressbar?: boolean;
    name?: string;
    description?: string;
    muted?: boolean;
    position: { left: number, top: number, };
    zoom: number;
    size: { width: number, height: number, };
    url: string;
    protected?: boolean;
    theater: { enabled: boolean };
}

export class Frame extends Model {
  public static readonly _namespace_ = "Frame";

  public addressbar = false;
  public name = "";
  public description = "";
  public muted = false;
  public position = { left: 0, top: 0, }
  public zoom = 2 / 3;
  public size = { width: (GameRawWidth * this.zoom), height: (GameRawHeight * this.zoom), }
  public url = KanColleURL;
  public protected = false;
  public theater: { enabled: boolean } = { enabled: true };

  public static override default = {
    __memory__: {
      addressbar: false,
      name: "MEMORY",
      description: "最後に開いてたサイズの記憶",
      muted: false,
      position: { left: 0, top: 0, },
      zoom: 2 / 3,
      size: { width: (GameRawWidth * (2 / 3)), height: (GameRawHeight * (2 / 3)), },
      url: KanColleURL,
      protected: true,
    },
  }

  public static async memory(): Promise<Frame> {
    return (await this.find("__memory__"))!;
  }

  public toWindowCreateData(): chrome.windows.CreateData {
    return {
      url: [this.url],
      type: "popup",
      width: this.size.width,
      height: this.size.height,
      left: this.position.left,
      top: this.position.top,
      focused: true,
    };
  }
}