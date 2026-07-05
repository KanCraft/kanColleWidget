import { FileSaveConfig } from "../models/configs/FileSaveConfig";
import { DownloadService } from "./DownloadService";
import { TempStorage } from "./TempStorage";
import { Launcher } from "./Launcher";

/**
 * 撮影済みスクリーンショットの後処理を設定に応じて振り分けるサービス。
 * 編集ページを開く設定なら TempStorage 経由で画像を編集ページへ渡し、
 * そうでなければそのままダウンロードする。
 */
export class ScreenshotService {
  constructor(
    private readonly config: FileSaveConfig,
    private readonly downloads: Pick<DownloadService, "download"> = new DownloadService(config),
    private readonly temp: Pick<TempStorage, "store"> = new TempStorage(),
    private readonly openEditPage: (key: string) => Promise<unknown> = (key) => Launcher.screenshotEdit(key),
  ) { }

  /**
   * 撮影画像を設定に応じて処理する
   * @param uri 撮影画像の dataURL
   */
  public async deliver(uri: string): Promise<void> {
    if (this.config.editBeforeSave) {
      const key = await this.temp.store(`capture_${Date.now()}`, uri);
      await this.openEditPage(key);
    } else {
      await this.downloads.download(uri);
    }
  }
}
