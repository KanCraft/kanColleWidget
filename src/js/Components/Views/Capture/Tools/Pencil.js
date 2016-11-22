import Tool from "./Base";

export default class Pencil extends Tool {
    constructor(canvas) {
        super(canvas);
    }
    onStart(ev) {
        super.onStart();
        this.prev = this.position(ev);
    }
    onMove(ev) {
        const next = this.position(ev);
        this.drawLine(next);
        this.prev = next;
    }
    onEnd() {
        super.onEnd();
    }
    drawLine(next) {
        this.context.beginPath();
        this.context.moveTo(this.prev.x, this.prev.y);
        this.context.lineTo(     next.x,      next.y);
        this.context.stroke();
    }
}
