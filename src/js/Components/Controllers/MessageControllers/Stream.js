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
        let a = document.createElement("a");
        a.href = url;
        a.download = "video.webm";
        a.click();
        window.revokeObjectURL(url);
        return Promise.resolve();
    });
}
