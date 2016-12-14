export class Sync {
    constructor(sync, local = localStorage) {
        this.sync = sync;
        this.local = local;
    }
    save(keys = [], reset = false) {
        let items = {};
        keys.map(key => {
            let item = this.local.getItem(key);
            if (item) items[key] = JSON.parse(item);
        });
        let clear = (reset) ? new Promise(resolve => this.sync.clear(resolve)) : Promise.resolve();
        return clear.then(() => {
            return new Promise(resolve => {
                this.sync.set(items, () => resolve(items));
            });
        });
    }
    load(keys = [], commit = true) {
        return new Promise(resolve => {
            this.sync.get(keys, items => {
                if (commit) this.commit(items);
                resolve(items);
            });
        });
    }
    commit(items) {
        Object.keys(items).map(key => {
            this.local.setItem(key, JSON.stringify(items[key]));
        });
    }
}
