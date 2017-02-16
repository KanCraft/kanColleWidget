
export default class LaunchPositionRecorder {
    constructor(client, context = window) {
        this.client = client;
        this.context = context;
    }
    mainGameWindow(delay) {

        // contextがiframe内（parentを持ってる）なら、parentにやらせる
        if (this.context != this.context.parent) return;

        this.interval = setInterval(() => {
            this.client.message("/launchposition/:update", {
                left: this.context.screenX,
                top:  this.context.screenY,
                architrave: { // エアロ領域とか言われる部分の大きさも記録しとく
                    x: this.context.outerWidth  - this.context.innerWidth,
                    y: this.context.outerHeight - this.context.innerHeight,
                }
            });
        }, delay);
    }
}
