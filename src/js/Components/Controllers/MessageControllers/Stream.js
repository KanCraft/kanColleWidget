import Streaming from "../../Services/Streaming";

export function StreamStartRecording() {
    return Streaming.instance().then(streaming => {
        streaming.startRecording();
        return Promise.resolve();
    });
}

export function StreamStopRecording() {
    return Streaming.instance().then(streaming => {
        return streaming.stopRecording();
    });
}
