import Tool, { DrawPosition } from "./DrawToolBase";
import WindowService from "../../../../Services/Window";

export default class Crop extends Tool {
  start: DrawPosition;
  end: DrawPosition;
  constructor(canvas) {
    super(canvas);
    // this.context.fillStyle = params.color || "#000";
    this.context.strokeStyle = "#fff";
    this.context.setLineDash([10, 5]);
    // this.fill = params.fill;
  }
  onStart(ev) {
    super.onStart(ev);
    this.start = this.position(ev);
  }
  onMove(ev) {
    this.end = this.position(ev);
    this.draw();
  }
  onEnd(ev) {
    this.end = this.position(ev);
    this.putBackup();
    this.crop();
    super.onEnd(ev);
  }
  draw() {
    this.putBackup();
    this.context.strokeRect(
      this.start.x, this.start.y,
      this.end.x - this.start.x, this.end.y - this.start.y
    );
  }
  crop() {
    const sx = Math.min(this.start.x, this.end.x),
      sy = Math.min(this.start.y, this.end.y),
      sw = Math.abs(this.end.x - this.start.x),
      sh = Math.abs(this.end.y - this.start.y);
    const data = this.context.getImageData(sx, sy, sw, sh);
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    canvas.getContext("2d").putImageData(data, 0, 0);
    const url = canvas.toDataURL("image/jpeg"); // TODO: 指定可能にする
    WindowService.getInstance().openCapturePage({ url }); // TODO: もろもろ省略しているので
  }
}