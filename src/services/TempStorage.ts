// chrome.storage.local と同じ非同期サーフェスのうち TempStorage が使う部分。
// テストでは in-memory 実装（jstorm/testing の MemoryStorageArea）を注入する
interface StorageAreaLike {
  get(keys?: string | string[] | null): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
}

// 保存エントリの形。expires（Epoch ミリ秒）を過ぎたものは取り出せない
interface TempEntry {
  value: string;
  expires: number;
}

/**
 * 大きめの画像 dataURL などを chrome.storage.local に一時保存し、
 * 取り出しと同時に削除するための受け渡し用ストレージ。
 * Service Worker で撮影したスクリーンショットを編集ページへ渡すケースで使う。
 * URL パラメータには載らないサイズのデータを、キーだけ URL で渡して受け取る。
 */
export class TempStorage {

  // 通常の設定・モデルのキーと衝突しないための名前空間接頭辞
  private static readonly PREFIX = "TempStorage:";

  private static readonly DEFAULT_EXPIRES_MS = 60 * 1000;

  constructor(private readonly storage: StorageAreaLike = chrome.storage.local) { }

  /**
   * 値を保存し、取り出しに使うキーを返す。
   * MV3 の Service Worker は停止しうるため setTimeout での遅延削除は当てにできず、
   * 期限切れエントリの掃除は保存のたびに行なう。
   * @param name キーの識別部（呼び出し側で一意にする）
   * @param value 保存する値
   * @param expiresIn 有効期間（ミリ秒）
   * @returns 取り出しに使うキー
   */
  public async store(name: string, value: string, expiresIn = TempStorage.DEFAULT_EXPIRES_MS): Promise<string> {
    await this.purgeExpired();
    const key = TempStorage.PREFIX + name;
    const entry: TempEntry = { value, expires: Date.now() + expiresIn };
    await this.storage.set({ [key]: entry });
    return key;
  }

  /**
   * 値を取得し、同時に削除する。
   * @param key store が返したキー
   * @returns 保存した値。存在しない・期限切れの場合は undefined
   */
  public async draw(key: string): Promise<string | undefined> {
    const items = await this.storage.get(key);
    const entry = items[key] as TempEntry | undefined;
    if (!entry) return undefined;
    await this.storage.remove(key);
    if (entry.expires < Date.now()) return undefined;
    return entry.value;
  }

  /**
   * 期限切れのまま残っているエントリを削除する
   */
  private async purgeExpired(): Promise<void> {
    const items = await this.storage.get(null);
    const now = Date.now();
    const expired = Object.keys(items).filter((key) =>
      key.startsWith(TempStorage.PREFIX) && ((items[key] as TempEntry).expires ?? 0) < now
    );
    if (expired.length > 0) await this.storage.remove(expired);
  }
}
