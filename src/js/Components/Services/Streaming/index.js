/* global MediaRecorder:false */
export default class Streaming {
    static options = {
        audio:false, video: true,
        videoConstraints: {
            mandatory: {
                chromeMediaSource: "tab",
                maxWidth: 800, maxHeight: 480
            }
        }
    }
    static __instance = null
    static instance() {
        if (this.__instance == null || !this.__instance.stream.active) {
            return new Promise(resolve => {
                chrome.tabCapture.capture(this.options, (stream) => {
                    this.__instance = new this(stream);
                    resolve(this.__instance);
                });
            });
        }
        return Promise.resolve(this.__instance);
    }
    constructor(stream) {
        this.stream = stream;
    }
    toBlobURL() {
        return URL.createObjectURL(this.stream);
    }
    onMediaRecorderStarted(ev) {
        this.chunks.push(ev.data);
    }
    startRecording() {
        this.chunks = [];
        this.recorder = new MediaRecorder(this.stream);
        this.recorder.ondataavailable = this.onMediaRecorderStarted.bind(this);
        this.recorder.start();
    }
    stopRecording() {
        this.recorder.stop();
        const blob = new Blob(this.chunks, {"type" : "video/webm; codecs=vp9"});
        // const blob = new Blob(this.chunks);
        this.chunks = [];
        return URL.createObjectURL(blob);
    }
}
