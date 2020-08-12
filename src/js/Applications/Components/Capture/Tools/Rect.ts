import Tool, { ToolParams, DrawPosition } from "./DrawToolBase";

/**
 * 四角形を書くやつ
 */
export default class Rect extends Tool {
  fill: boolean;
  start: DrawPosition;
  end: DrawPosition;
  constructor(canvas, params: ToolParams = {}) {
    super(canvas);
    this.context.fillStyle = params.color || "#000";
    this.context.strokeStyle = params.color || "#000";
    this.fill = params.fill;
  }
  onStart(ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    super.onStart(ev);
    this.start = this.position(ev);
  }
  onMove(ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    this.putBackup();
    this.end = this.position(ev);
    this.draw();
  }
  onEnd(ev: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    this.putBackup();
    this.end = this.position(ev);
    this.draw();
    super.onEnd(ev);
  }
  draw() {
    if (this.fill) {
      this.context.fillRect(
        this.start.x, this.start.y,
        this.end.x - this.start.x, this.end.y - this.start.y
      );
    } else {
      this.context.strokeRect(
        this.start.x, this.start.y,
        this.end.x - this.start.x, this.end.y - this.start.y
      );
    }
  }
}