import Tool from "./Base";

export default class Text extends Tool {
    constructor(canvas, params = {}) {
        super(canvas);
        this.color = params.color || "#000";
        this.text  = params.text  || "";
        this.font  = params.font  || "4em Arial";
    }
    onStart(ev) {
        super.onStart();
        this.backup = this.context.getImageData(
          0, 0, this.canvas.width, this.canvas.height
        );
        this.context.fillStyle = this.color;
        this.context.font      = this.font;
        const pos = this.position(ev);
        this.context.fillText(this.text, pos.x, pos.y);
    }
    onMove(ev) {
        this.context.putImageData(this.backup, 0, 0);
        const pos = this.position(ev);
        this.context.fillText(this.text, pos.x, pos.y);
    }
    onEnd() {
        super.onEnd();
    }
}
