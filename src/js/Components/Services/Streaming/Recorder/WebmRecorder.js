/* global MediaRecorder:false */

export default class WebmRecorder {
    constructor(/* MediaStream */stream) {
        // this.stream = stream;
        this.recorder = new MediaRecorder(stream);
        this.chunks = [];
        this.mimeType = "video/webm";
    }
    start(/* option */) {
        this.chunks = [];
        this.recorder.ondataavailable = (ev) => {
            this.chunks.push(ev.data);
        };
        return this.recorder.start();
    }
    stop() {
        this.recorder.stop();
        const blob = new Blob(this.chunks, {mimeType:this.mimeType});
        this.chunks = [];
        return Promise.resolve({
            type: "video/webm",
            ext:  ".webm",
            url:  URL.createObjectURL(blob),
        });
    }
}
