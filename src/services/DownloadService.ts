import { FileSaveConfig } from "../models/configs/FileSaveConfig";

export class DownloadService {
  constructor(
    private readonly config: FileSaveConfig,
    private readonly mod = chrome.downloads,
  ) { }

  public async download(url: string, filename?: string): Promise<number> {
    filename = filename || (this.config.folder + "/" + this.config.getFilename(new Date()));
    return new Promise((resolve, reject) => {
      this.mod.download({ url, filename }, (id) => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve(id);
      });
    });
  }
  public async show(downloadId: number) {
    return this.mod.show(downloadId);
  }
}