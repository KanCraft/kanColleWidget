import Tool from "./Base";

export default class Trim extends Tool {
    constructor(canvas, params = {}) {
        super(canvas);
        this.context.strokeStyle = params.color || "#000";
        this.context.setLineDash([4,4]);
    }
    onStart(ev) {
        super.onStart();
        this.start = this.position(ev);
    }
    onMove(ev) {
        this.putBackup();
        this.end = this.position(ev);
        this.drawFrame();
    }
    onEnd(ev) {
        this.putBackup();
        this.end = this.position(ev);
        this.open();
        super.onEnd();
    }
    open() {
        let data = this.context.getImageData(
          this.start.x, this.start.y,
          this.end.x - this.start.x, this.end.y - this.start.y
        );
        let tmp = document.createElement("canvas");
        tmp.width = Math.abs(this.end.x - this.start.x);
        tmp.height = Math.abs(this.end.y - this.start.y);
        tmp.getContext("2d").putImageData(data, 0, 0);
        let params = new URLSearchParams();
        params.set("img", tmp.toDataURL());
        window.open("?" + params.toString());
    }
    drawFrame() {
        this.context.strokeRect(
          this.start.x, this.start.y,
          this.end.x - this.start.x, this.end.y - this.start.y
        );
    }
}
