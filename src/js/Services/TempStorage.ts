
/**
 * TempStorage
 * 大きめの画像URIなんかを一時的に保存、取り出しと同時に削除することを目的としたもの.
 * とくにスクショ編集画面に画像URIを伝えるケースで使う.
 * 当初はlocalStorageを使っていたが、localStorageでは"unlimitedStorage"の恩恵を受けないので、
 * chrome.storage.localを使っている.
 */
export default class TempStorage {

  constructor(private storage = chrome.storage.local) {}

  static new(): TempStorage {
    return new this();
  }

  private get(key: string): Promise<string> {
    return new Promise(resolve => {
      this.storage.get(items => {
        resolve(items[key]);
      });
    });
  }

  private delete(key: string) {
    return new Promise<void>(resolve => {
      this.storage.remove(key, () => resolve());
    });
  }

  store(key: string, value: string, expires = 60 * 1000): Promise<string> {
    setTimeout(() => this.delete(key), expires);
    return new Promise(resolve => {
      this.storage.get(items => {
        items[key] = value;
        this.storage.set(items, () => resolve(key));
      });
    });
  }

  /**
   * 取得し、消す。
   */
  async draw(key: string, clean = true): Promise<string> {
    const value: string = await this.get(key);
    if (!!value && clean) {
      this.delete(key);
    }
    return value;
  }

}
