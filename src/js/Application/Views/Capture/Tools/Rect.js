import Tool from "./Base";

export default class Rect extends Tool {
  constructor(canvas, params = {}) {
    super(canvas);
    this.context.fillStyle = params.color || "#000";
    this.context.strokeStyle = params.color || "#000";
    this.fill = params.fill;
  }
  onStart(ev) {
    super.onStart();
    this.start = this.position(ev);
  }
  onMove(ev) {
    this.putBackup();
    this.end = this.position(ev);
    this.draw();
  }
  onEnd(ev) {
    this.putBackup();
    this.end = this.position(ev);
    this.draw();
    super.onEnd();
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
