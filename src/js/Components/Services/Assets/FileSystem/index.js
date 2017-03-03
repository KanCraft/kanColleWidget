const requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

export default class FileSystem {
  constructor(context = window) {
    this.context = context;
    this.LIMIT   = 1024 * 1024 * 5;
  }
  _fs() {
    return new Promise((resolve, reject) => {
      requestFileSystem(this.context.PERSISTENT, this.LIMIT, resolve, reject);
    });
  }
    /**
     * @private
     * あらゆるFileEntryをかえす
     */
  _file(filepath) {
    return this._fs().then(fs => {
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

  getMimeType(base64) {
    const [ , mimetype, ] = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9]+);base64,(.+)$/);
    return mimetype;
  }
  fileFromBase64(base64, name, type) {
        // return new Blob([btoa(content)], {type: mimetype});
    return fetch(base64).then(res => res.arrayBuffer())
        .then(buf => Promise.resolve(new File([buf], name, {type})));
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
