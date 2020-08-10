
export default class DownloadService {
  constructor(private mod = chrome.downloads) {}
  static new() {
    return new this();
  }
  async download(opt: chrome.downloads.DownloadOptions): Promise<number> {
    this.mod.setShelfEnabled(false);
    return new Promise(resolve => {
      this.mod.download({ saveAs: false, ...opt }, (id) => {
        setTimeout(() => this.mod.setShelfEnabled(true), 1000);
        resolve(id);
      });
    });
  }
  show(id: number) { this.mod.show(id); }
  showDefaultFolder() { this.mod.showDefaultFolder(); }
}