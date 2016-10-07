
export default class CaptureService {
    constructor(mod = chrome) {
        this.module = mod;
    }

    capture(windowId) {
        return new Promise(resolve => {
            this.module.tabs.captureVisibleTab(windowId, {}, resolve);
        });
    }
}
