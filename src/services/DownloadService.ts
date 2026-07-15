import { FileSaveConfig } from "../models/configs/FileSaveConfig";

export class DownloadService {
  constructor(
    private readonly config: FileSaveConfig,
    private readonly mod = chrome.downloads,
  ) { }

  public async download(url: string): Promise<number> {
    const filename = this.config.folder + "/" + this.config.getFilename(new Date());
    return this.mod.download({ url, filename, saveAs: this.config.askAlways });
  }

  public async show(downloadId: number) {
    return this.mod.show(downloadId);
  }

  /**
   * ファイル保存設定を参照せず、指定 URL・ファイル名でダウンロードフォルダ直下に保存する。
   * 保存ダイアログは出さない（saveAs: false）。
   */
  public static async direct(url: string, filename: string, mod = chrome.downloads): Promise<number> {
    return mod.download({ url, filename, saveAs: false });
  }

  /**
   * canvas をユーザーのファイル保存設定に従って画像として保存する。
   * 実際のエンコード形式とファイル名の拡張子が一致するよう、
   * toDataURL のフォーマット指定（config.format）もここで行う。
   */
  public static async saveCanvasAsImage(canvas: HTMLCanvasElement): Promise<number> {
    const config = await FileSaveConfig.user();
    const uri = canvas.toDataURL(`image/${config.format}`);
    return new DownloadService(config).download(uri);
  }
}
