import { GameRawHeight, GameRawWidth } from "../constants";
import { WorkerImage } from "../utils";

type Purpose = "game" | "recovery" | "shipbuild" | "damagesnapshot";

/**
 * 画像の切り抜き範囲を表すクラス
 */
export class Rectangle {
  public size: { w: number, h: number };
  public start: { x: number, y: number };
  constructor(w: number, h: number, x = 0, y = 0) {
    this.size = { w, h };
    this.start = { x, y };
  }
  public game(): Rectangle {
    const a = this.size.h / this.size.w;
    const r = GameRawHeight / GameRawWidth;
    if (a - r > 0) return new Rectangle(this.size.w, this.size.w * r, 0, (this.size.h - (this.size.w * r)) / 2); // タテなが
    else if (a - r < 0) return new Rectangle(this.size.h / r, this.size.h, (this.size.w - (this.size.h / r)) / 2, 0); // ヨコなが
    return this;
  }
  public recovery(): Rectangle {
    const g = this.game();
    return new Rectangle(
      g.size.w * (1 / 8),
      g.size.h * (36 / 720),
      g.start.x + (g.size.w * (55 / 100)),
      g.start.y + (g.size.h * (57 / 100)),
    );
  }
  public shipbuild(dock: number): Rectangle {
    const g = this.game();
    // ドックひとつずれたときのY開始位置
    const dockOffset = g.size.h * (120 / 720);
    return new Rectangle(
      g.size.w * (148 / 1200),
      g.size.h * (32 / 720),
      g.start.x + (g.size.w * (592 / 1200)),
      g.start.y + (g.size.h * (268 / 720)) + ((dock - 1) * dockOffset),
    );
  }
  public damagesnapshot(): Rectangle {
    const g = this.game();
    return new Rectangle(
      g.size.w * (5 / 24),
      g.size.h * (103 / 180),
      g.start.x + (g.size.w * (6 / 25)),
      g.start.y + (g.size.h * (7 / 18)),
    );
  }

  public transform(purpose: Purpose, params: { dock: number } = { dock: 0 }): Rectangle {
    switch (purpose) {
    case "recovery": return this.recovery();
    case "shipbuild": return this.shipbuild(params.dock as number);
    case "damagesnapshot": return this.damagesnapshot();
    case "game": return this.game();
    default: return this.game();
    }
  }
}

export class CropService {
  constructor(public image: WorkerImage) {}

  /**
   * 与えられた目的で画像を切り抜いてURLを返す
   * 使用する側がURLをrevokeObjectURLする必要がある
   * @param purpose
   * @param params
   * @returns {Promise<string>} URL
   */
  async crop(purpose: Purpose, params: { dock: number } = { dock: 0 }): Promise<string> {
    const rect = new Rectangle(this.image.bitmap.width, this.image.bitmap.height);
    const crop = rect.transform(purpose, params);
    const canvas = new OffscreenCanvas(crop.size.w, crop.size.h);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2d context");
    ctx.drawImage(this.image.bitmap, crop.start.x, crop.start.y, crop.size.w, crop.size.h, 0, 0, crop.size.w, crop.size.h);
    const blob = await canvas.convertToBlob({ type: "image/png" });
    const dataUri = await this.blobToDataUri(blob);
    return dataUri;
  }

  private blobToDataUri(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
