
class NotificationService {
    constructor(mod = chrome.notifications) {
        this.module = mod;
    }

    create(id, options) {
        return new Promise(resolve => {
            this.module.create(id, options, resolve);
        });
    }

    clear(id) {
        if (typeof id == "function") return this.clearFunc(id);
        return new Promise(resolve => {
            this.module.clear(id, resolve);
        });
    }

    clearFunc(fn) {
        return Promise.resolve()
        .then(() => new Promise(resolve => this.module.getAll(resolve)))
        .then(notes => Promise.resolve(Object.keys(notes).filter(fn)))
        .then(ids => ids.map(id => new Promise(resolve => this.module.clear(id, resolve))))
        .then(promises => Promise.all(promises));
    }
}

export default NotificationService;
