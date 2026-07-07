import { FileSaveConfig } from "../models/configs/FileSaveConfig";

export class DownloadService {
  constructor(
    private readonly config: FileSaveConfig,
    private readonly mod = chrome.downloads,
  ) { }

  public async download(url: string, filename?: string): Promise<number> {
    filename = filename || (this.config.folder + "/" + this.config.getFilename(new Date()));
    const options: chrome.downloads.DownloadOptions = {
      url,
      filename,
      saveAs: this.config.askAlways,
    };
    return this.mod.download(options);
  }
  public async show(downloadId: number) {
    return this.mod.show(downloadId);
  }
}
