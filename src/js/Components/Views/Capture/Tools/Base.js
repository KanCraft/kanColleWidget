
export default class Tool {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.growth = this.canvas.width / this.canvas.offsetWidth;
    }
    onStart() {
        this.context.save();
    }
    onMove() {
    }
    onEnd() {
        this.context.restore();
    }
    position(ev) {
        return {
            x: ev.nativeEvent.offsetX * this.growth,
            y: ev.nativeEvent.offsetY * this.growth
        };
    }
}
