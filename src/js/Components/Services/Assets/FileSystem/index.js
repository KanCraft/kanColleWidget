const requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

export default class FileSystem {
    constructor(context = window) {
        this.context = context;
        this.LIMIT   = 1024 * 1024 * 5;
    }
    fs() {
        return new Promise((resolve, reject) => {
            requestFileSystem(this.context.PERSISTENT, this.LIMIT, resolve, reject);
        });
    }
    /**
     * @private
     * あらゆるFileEntryをかえす
     */
    _file(filepath) {
        return this.fs().then(fs => {
            return new Promise((resolve, reject) => {
                fs.root.getFile(filepath, {create:true,exclusive:false},resolve,reject);
            });
        });
    }
    /**
     * @private
     */
    _write(entry, writer, file) {
        return new Promise((resolve, reject) => {
            writer.onwriteend = () => resolve({entry, file});
            writer.onerror = reject;
            // execute
            writer.write(file);
        });
    }

    /**
     * upsertしたい
     */
    set(filepath, file) {
        return this.delete(filepath).then(() => this._file(filepath))
        .then(entry => {
            return new Promise((resolve, reject) => {
                entry.createWriter((writer) => {
                    resolve({entry, writer});
                }, reject);
            });
        })
        .then(({entry, writer}) => {
            return this._write(entry, writer, file);
        });
    }
    delete(filepath) {
        return this._file(filepath)
        .then(entry => {
            return new Promise((resolve, reject) => {
                entry.remove(() => {
                    resolve(entry);
                }, reject);
            });
        });
    }
}
