var Worker = require("worker-loader?inline!../../../Workers/gif-encoder/worker");

export default class GifRecorder {
    constructor(stream, option) {
        this.stream   = stream;
        this.mimeType = "image/gif";

        this.width  = option.width  || 800;
        this.height = option.height || 480;

        this.video          = document.createElement("video");
        this.video.src      = URL.createObjectURL(stream);
        this.video.width    = this.width;
        this.video.height   = this.height;
        // this.video.autoplay = true;
        this.video.play();

        this.canvas        = document.createElement("canvas");
        this.canvas.width  = this.width;
        this.canvas.height = this.height;
        this.ctx           = this.canvas.getContext("2d");

        this.worker = new Worker();
        this.onWorkerResultedPromise = new Promise((resolve, reject) => {
            this.worker.addEventListener("message", ev => {
                const message = ev.data;
                if (message.status !== 200) return reject(message);
                resolve({
                    type: "image/gif",
                    ext:  ".gif",
                    url: URL.createObjectURL(this._toBlob(message.data.base64)),
                });
                // XXX: It works!!
                // window.open("data:image/gif;base64," + message.data.base64);
                // XXX: It works!!!!
                // const blob = this._toBlob(message.data.base64);
                // window.open(URL.createObjectURL(blob));
            });
        });
        this.worker.postMessage({
            cmd:"init",
            root:chrome.extension.getURL("/dest/worker-imports"),
        });
    }
    start() {
        // TODO: FPSはoptionで変えれるようにする
        // TODO: このintervalのmillisecは、encoder.setDelayと等しくないといけない
        this.id = setInterval(() => this._sendFrameData(), 25);
    }
    stop() {
        clearInterval(this.id);
        this.worker.postMessage({cmd:"finish"});
        return this.onWorkerResultedPromise;
    }
    _sendFrameData() {
        this.worker.postMessage({cmd:"add", frame: this._makeFrameData()});
    }
    _makeFrameData() {
        this.ctx.drawImage(this.video, 0, 0, this.width, this.height);
        const frame = this.ctx.getImageData(0, 0, this.width, this.height).data;
        return frame;
    }
    _toBlob(base64) {
        let bytes = atob(base64);
        let buffer = new ArrayBuffer(bytes.length);
        let bitmap = new Uint8Array(buffer);
        for (var i = 0; i < bytes.length; i++) {
            bitmap[i] = bytes.charCodeAt(i);
        }
        return new Blob([buffer], {type:"image/gif"});
    }
}
