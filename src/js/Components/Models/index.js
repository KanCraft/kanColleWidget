export class Sync {
    constructor(sync, local = localStorage) {
        this.sync = sync;
        this.local = local;
    }
    save(keys = [], reset = false) {
        let items = {};
        keys.map(key => {
            items[key] = JSON.parse(this.local.getItem(key) || {});
        });
        let clear = (reset) ? new Promise(resolve => this.sync.clear(resolve)) : Promise.resolve();
        return clear.then(() => {
            return new Promise(resolve => {
                this.sync.set(items, resolve);
            });
        });
    }
    load(keys = [], dry = false) {
        return new Promise(resolve => {
            this.sync.get(keys, items => {
                if (dry) return resolve(items);
                Object.keys(items).map(key => {
                    this.local.setItem(key, JSON.stringify(items[key]));
                });
                resolve(items);
            });
        });
    }
}
