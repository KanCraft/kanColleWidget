import DeckCapture from "../../Applications/Models/DeckCapture";
import Constants from "../../Constants";

export interface ComposeStrategy {
  begin(): void;
  put(i: number, imageURI: string): Promise<void>;
  end(): string;
}

export class DeckCaptureStrategy implements ComposeStrategy {

  scale = 0.4;

  private canvas: HTMLCanvasElement;

  // scaleを加味したcanvas上のcellの大きさ
  private cell: {w: number, h: number};

  constructor(public setting: DeckCapture, private scope: Document = document) {}

  begin(): void {
    this.canvas = this.scope.createElement("canvas");
    this.cell = {
      w: Constants.GameWidth * this.scale * this.setting.cell.w,
      h: Constants.GameHeight * this.scale * this.setting.cell.h,
    };
    // {{{ FIXME: ページは横並びという前提のコードである
    this.canvas.width  = (this.cell.w * this.setting.col) * this.setting.page;
    this.canvas.height = (this.cell.h * this.setting.row);
    // }}}
  }

  async put(i: number, uri: string): Promise<void> {
    const img = this.scope.createElement("img");
    setTimeout(() => img.src = uri);
    return new Promise(resolve => {
      img.onload = () => {
        this.draw(i, img);
        resolve();
      };
    });
  }

  private draw(i: number, img: HTMLImageElement) {
    const ctx = this.canvas.getContext("2d");
    const coord = this.getCoordFor(i);
    ctx.drawImage(img, coord.x, coord.y, this.cell.w, this.cell.h);
  }

  private getCoordFor(i: number): { x: number, y: number } {
    // これは幾何学上の座標
    const coord = {x: 0, y: 0};
    coord.x = i % this.setting.col;
    coord.y = Math.floor(i / this.setting.col);
    if (this.setting.page > 1) {
      // {{{ FIXME: ページは横並びという前提のコードである
      const cellsPerPage = (this.setting.col * this.setting.row);
      const page = Math.floor(i / cellsPerPage);
      coord.x = coord.x + (page * this.setting.col);
      coord.y = coord.y % this.setting.row;
      // }}}
    }
    // 幾何学上の座標が決定したので、scaleで補正する
    return {
      x: coord.x * this.cell.w,
      y: coord.y * this.cell.h,
    };
  }

  end(): string {
    const uri = this.canvas.toDataURL();
    this.canvas = null;
    return uri;
  }
}

export default class ComposeImageService {
  constructor(private strategy: ComposeStrategy) {}
  static withStrategyFor(entry: DeckCapture): ComposeImageService {
    switch (entry.constructor) {
    case DeckCapture: return new ComposeImageService(new DeckCaptureStrategy(entry));
    default: throw new Error(`Unkonwn strategy provider: ${entry.constructor.name}`);
    }
  }
  async compose(imageURIs: string[]): Promise<string> {
    this.strategy.begin();
    for (let i = 0; i < imageURIs.length; i++) {
      await this.strategy.put(i, imageURIs[i]);
    }
    return this.strategy.end();
  }
}