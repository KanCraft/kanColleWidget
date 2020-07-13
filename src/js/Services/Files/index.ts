export default class FileService {

  private _fs: FileSystem = null;

  constructor(
    public prefix = "kcw",
    public size = 1024 * 1024, // 1G
    private type = window.PERSISTENT,
    private requestFileSystem = (window.requestFileSystem || window.webkitRequestFileSystem).bind(window),
  ) {}

  async init(): Promise<FileService> {
    return new Promise((resolve, reject) => {
      this.requestFileSystem(this.type, this.size, (filesystem: FileSystem) => {
        this._fs = filesystem;
        resolve(this);
      }, reject);
    });
  }

  private write(entry: FileEntry, data: Blob) {
    return new Promise((resolve, reject) => {
      entry.createWriter((writer: FileWriter) => {
        writer.onwriteend = resolve;
        writer.onerror = reject;
        writer.write(data);
      }, reject);
    });
  }

  /**
   * upsertします
   * @param {string} filepath Prefixを知らないファイルパス
   * @param {File} file
   * @returns {string} ファイルURL
   */
  async save(filepath: string, file: File): Promise<string> {
    await this.delete(filepath, true);
    const entry = await this.get(filepath);
    await this.write(entry, file);
    return entry.toURL();
  }

  /**
   * @param {string} filepath
   * @param {bool} ignoreError 無くてもrejectしない
   */
  async delete(filepath: string, ignoreError = true) {
    const entry = await this.get(filepath);
    return new Promise((resolve, reject) => entry.remove(resolve, (err) => ignoreError ? resolve() : reject(err)));
  }

  /**
   * Prefixを追加するのはここだけってことにしたいな
   * @param {string} filepath Prefixを知らないファイルパスが来る
   */
  get(filepath: string): Promise<FileEntry> {
    filepath = [this.prefix, filepath].join("_");
    return new Promise((resolve, reject) => {
      this._fs.root.getFile(filepath, { create: true, exclusive: false }, resolve, reject);
    });
  }
}