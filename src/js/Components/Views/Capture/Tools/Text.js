import Tool from "./Base";

export default class Text extends Tool {
    constructor(canvas, params = {}) {
        super(canvas);
        this.color = params.color || "#000";
        this.text  = params.text  || "";
        this.font  = [params.size, params.font].join(" ");
    }
    onStart(ev) {
        super.onStart();
        this.context.fillStyle = this.color;
        this.context.font      = this.font;
        const pos = this.position(ev);
        this.context.fillText(this.text, pos.x, pos.y);
    }
    onMove(ev) {
        this.putBackup();
        const pos = this.position(ev);
        this.context.fillText(this.text, pos.x, pos.y);
    }
    onEnd() {
        super.onEnd();
    }
}
