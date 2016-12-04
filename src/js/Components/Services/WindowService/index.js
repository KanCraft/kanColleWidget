
class WindowService {

    static instance = null;

    static getInstance() {
        if (!WindowService.instance) {
            WindowService.instance = new this();
        }
        return WindowService.instance;
    }

    constructor(mod = chrome) {
        this.module = mod;
    }

    open(frame, position = {}) {
        return new Promise((resolve/*, reject */) => {
            this.module.windows.create(frame.toCreatePrams(position), (win) => {
                this.tab = {
                    id: win.tabs[0].id,
                    windowId: win.id,
                    frame:    frame,
                };
                resolve(win);
            });
        });
    }

    has(tabId) {
        if (this.tab.id == tabId) return this.tab;
        return null;
    }

  // find finds tab opened
    find(strict = false, query = {
        url: [
            "http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/",
            "http://osapi.dmm.com/gadgets/ifr*"
        ]
    }) {
        return new Promise((resolve, reject) => {
            this.module.tabs.query(query, tabs => {
                if (tabs.length == 0 && strict) return reject();
                resolve(tabs[0]);
            });
        });
    }

    focus(tab) {
        return new Promise((resolve) => {
            this.module.windows.update(tab.windowId, {
                focused: true
            }, resolve);
        });
    }

    zoom(tabId, zoom) {
        return new Promise(resolve => {
            this.module.tabs.setZoomSettings(tabId, {
                mode: "automatic", scope: "per-tab", defaultZoomFactor: 1
            }, () => {
                this.module.tabs.setZoom(tabId, zoom, resolve);
            });
        });
    }

    mute(tab, muted = true) {
        return new Promise(resolve => {
            this.module.tabs.update(tab.id, {muted}, resolve);
        });
    }
}

export default WindowService;
