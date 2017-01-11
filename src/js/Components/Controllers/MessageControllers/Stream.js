import Streaming from "../../Services/Streaming";

export function StreamStartRecording() {
    return Streaming.instance().then(streaming => {
        streaming.startRecording();
        return Promise.resolve();
    });
}

export function StreamStopRecording() {
    return Streaming.instance().then(streaming => {
        const url = streaming.stopRecording();
        return Promise.resolve({url});
    });
}
