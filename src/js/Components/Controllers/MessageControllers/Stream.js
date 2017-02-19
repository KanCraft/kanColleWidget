import Streaming from "../../Services/Streaming";

export function StreamStartRecording() {
    return Streaming.instance().then(streaming => {
        streaming.startRecording();
        return Promise.resolve();
    });
}

export function StreamStopRecording() {
    return Streaming.instance().then(streaming => {
        streaming.stopRecording().then(res => {
            window.open(res.url);
        });
        return Promise.resolve(true);
    });
}
