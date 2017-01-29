import MediaStreamRecorder from "msr";
// MediaRecorder = MediaStreamRecorder;

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
    startRecording() {
        this.recorder = new MediaStreamRecorder(this.stream);
        // this.recorder.mimeType = "video/mp4";
        this.recorder.mimeType = "video/webm";
        this.onDataAvailable = new Promise(resolve => {
            this.recorder.ondataavailable = (blob) => {
                resolve(blob);
            };
        });
        this.recorder.start();
    }
    stopRecording() {
        this.recorder.stop();
        return this.onDataAvailable.then(blob => {
            return Promise.resolve({
                url: URL.createObjectURL(blob),
                type: blob.type,
            });
        });
    }
}
