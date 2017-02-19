import Recorder from "./Recorder";

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
        // TODO: これrevokeしないといけない気がするんだよなあ
        return URL.createObjectURL(this.stream);
    }
    startRecording() {
        this.recorder = new Recorder(this.stream);
        this.recorder.start();
    }
    stopRecording() {
        return this.recorder.stop();
    }
}
