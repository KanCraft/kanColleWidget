import Tool from "./Base";

export default class Pencil extends Tool {
    constructor(canvas) {
        super(canvas);
        this.width = 6;
    }
    onStart(ev) {
        super.onStart();
        this.context.lineWidth = this.width;
        const start = this.position(ev);
        this.drawPoint(start);
        this.prev = start;
    }
    onMove(ev) {
        const next = this.position(ev);
        this.drawLine(next);
        this.drawPoint(next);
        this.prev = next;
    }
    onEnd(ev) {
        this.drawPoint(this.position(ev));
        super.onEnd();
    }
    drawLine(next) {
        this.context.beginPath();
        this.context.moveTo(this.prev.x, this.prev.y);
        this.context.lineTo(     next.x,      next.y);
        this.context.stroke();
    }
    drawPoint(pos) {
        this.context.beginPath();
        this.context.arc(pos.x, pos.y, this.width/2, 0, 2 * Math.PI);
        this.context.fill();
    }
}
