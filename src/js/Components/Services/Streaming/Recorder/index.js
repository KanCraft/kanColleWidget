import GifRecorder  from "./GifRecorder";
import WebmRecorder from "./WebmRecorder";

export const GIF  = "gif";
export const WEBM = "webm";

export default class Recorder {
    constructor(stream, option = {type:WEBM}) {
        let Implement = () => {};
        switch(option.type) {
        case GIF:  Implement = GifRecorder;  break;
        case WEBM: Implement = WebmRecorder; break;
        default:   Implement = WebmRecorder; break;
        }
        this.imple = new Implement(stream, option);
    }
    start(option) {
        this.imple.start(option);
    }
    stop() {
        return this.imple.stop();
    }
}
