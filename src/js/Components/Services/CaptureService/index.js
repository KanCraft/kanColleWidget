
export default class CaptureService {
    constructor(mod = chrome) {
        this.module = mod;
    }

    capture(windowId) {
        if (typeof windowId == "object") {
            windowId = windowId.id;
        }
        return new Promise(resolve => {
            this.module.tabs.captureVisibleTab(windowId, {}, resolve);
        });
    }
}
