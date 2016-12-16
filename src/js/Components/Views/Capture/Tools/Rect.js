import Tool from "./Base";

export default class Rect extends Tool {
    constructor(canvas, params = {}) {
        super(canvas);
        this.context.fillStyle = params.color || "#000";
    }
    onStart(ev) {
        super.onStart();
        this.start = this.position(ev);
    }
    onMove(ev) {
        this.putBackup();
        this.end = this.position(ev);
        this.fillRect();
    }
    onEnd(ev) {
        this.putBackup();
        this.end = this.position(ev);
        this.fillRect();
        super.onEnd();
    }
    fillRect() {
        this.context.fillRect(
          this.start.x, this.start.y,
          this.end.x - this.start.x, this.end.y - this.start.y
        );
    }
}
