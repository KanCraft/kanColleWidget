
export default class Tool {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.growth = this.canvas.width / this.canvas.offsetWidth;
    this.cursor = "default";
  }
  onStart() {
    this.context.save();
    this.getBackup();
  }
  onMove() {
  }
  onEnd() {
    this.context.restore();
  }
    // Utilities
  position(ev) {
    return {
      x: ev.nativeEvent.offsetX * this.growth,
      y: ev.nativeEvent.offsetY * this.growth
    };
  }
  getBackup() {
    this._backup = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }
  putBackup() {
    this.context.putImageData(this._backup, 0, 0);
  }
}
