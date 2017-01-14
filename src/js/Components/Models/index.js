export class Sync {
    constructor(sync, local = localStorage) {
        this.sync = sync;
        this.local = local;
    }
    save(keys = [], reset = false) {
        let items = {};
        keys.map(key => {
            let raw = this.local.getItem(key);
            if (raw) {
                let item = JSON.parse(raw);
                item = this.cleanup(item);
                items[key] = item;
            }
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
                items = this.removeOldScheduledQueues(items);
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
    removeOldScheduledQueues(items) {
        if (items["ScheduledQueues"]) {
            for (let name in items["ScheduledQueues"]) {
                items["ScheduledQueues"][name].queues = items["ScheduledQueues"][name].queues.filter(q => q.scheduled > Date.now());
            }
        }
        return items;
    }
    /**
     * たいへんにみにくいんですが、chromeモジュールを持っているモデルを保存しようとする場合
     * 巨大になっちゃうので、それ（とか）を削除するやつです
    **/
    cleanup(orig) {
        let item = {...orig};
        Object.keys(item).map(name => {
            if (!item[name].hasOwnProperty("queues")) return;
            (item[name].queues || []).map((queue, index) => {
                delete queue["assets"];
                item[name].queues[index] = queue;
            });
        });
        return item;
    }
}
