/**
 * Rectangleとかとなかよし
 */
import Rectangle from "./Rectangle";

export default class TrimService {

  static init(imgURL): Promise<TrimService> {
    const s: TrimService = new TrimService();
    s.img = s.scope.createElement("img");
    setTimeout(() => s.img.src = imgURL);
    return new Promise(resolve => {
      s.img.onload = () => resolve(s);
    });
  }

  canvas: HTMLCanvasElement;
  img: HTMLImageElement;

  constructor(private scope: Document = document) {}

  trim(rect: Rectangle): string {
    this.canvas = this.scope.createElement("canvas");
    this.canvas.width = rect.size.w;
    this.canvas.height = rect.size.h;
    const ctx: CanvasRenderingContext2D = this.canvas.getContext("2d");
    ctx.drawImage(
      this.img,
      rect.start.x, rect.start.y, rect.size.w, rect.size.h,
      0, 0, this.canvas.width, this.canvas.height,
    );
    return this.canvas.toDataURL();
  }
}
