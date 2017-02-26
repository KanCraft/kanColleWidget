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
        this.recorder.start();
        this.onMediaRecorderStoppedPromise = new Promise((resolve, reject) => {
            try {
                this.recorder.onstop = () => {
                    const blob = new Blob(this.chunks, {type:this.mimeType});
                    this.chunks = [];
                    resolve({
                        type: "video/webm",
                        ext:  ".webm",
                        url:  URL.createObjectURL(blob),
                    });
                };
            } catch(err) {
                reject(err);
            }
        });
        return;
    }
    stop() {
        this.recorder.stop();
        return this.onMediaRecorderStoppedPromise;
    }
}
