
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
                    mutedInfo: win.tabs[0].mutedInfo,
                    windowId: win.id,
                    frame:    frame,
                };
                resolve(win);
            });
        });
    }
    openManualWindow(type, identifier) {
        const w = 300;
        const h = 170;
        return new Promise(resolve => {
            this.module.windows.create({
                url: `/dest/html/manual.html?type=${type}&identifier=${identifier}`,
                type: "popup",
                width: w,
                height: h,
            }, resolve);
        });
    }
    openDamagaSnapshot(position = {}) {
        const r = 124 / 200;
        const h = position.height || 200;
        const w = position.width  || h * r;
        return new Promise(resolve => {
            this.module.windows.create({
                url:    this.module.extension.getURL("dest/html/dsnapshot.html"),
                type:  "popup",
                height: h,
                width:  w,
                left:   position.left || 0,
                top:    position.top  || 0,
            }, resolve);
        });
    }
    getDamageSnapshot() {
        return new Promise(resolve => {
            this.module.tabs.query({url: this.module.extension.getURL("dest/html/dsnapshot.html")}, resolve);
        });
    }
    openDashboard(position = {}) {
        this.module.windows.create({
            url:    this.module.extension.getURL("dest/html/dashboard.html"),
            type:  "popup",
            height: position.height || 292,
            width:  position.width || 400,
            left:   position.left || 0,
            top:    position.top  || 0,
        });
    }
    get(id, type = "window") {
        return new Promise(resolve => {
            this.module[type + "s"].get(id, res => {
                resolve(res);
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
