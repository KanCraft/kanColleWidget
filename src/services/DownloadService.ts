
export class DownloadService {
  constructor(
    private readonly mod = chrome.downloads,
  ) { }

  public static filename = {
    screenshot: (opt: { dir?: string, format: "jpeg" | "png" }) => {
      const datetime =  new Date().toISOString().replace(/[-:]/g, "").replace("T", "_").replace("Z", "").replace(/\..+/, "");
      return opt.dir ? `${opt.dir}/${datetime}.${opt.format}` : `艦これ_${datetime}.${opt.format}`;
    },
  }
  public async download(url: string, filename: string): Promise<number> {
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