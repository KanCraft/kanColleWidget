
export default class TempStorage {

  constructor(private storage: Storage = localStorage) {}

  private get(key: string): string {
    return this.storage.getItem(key);
  }

  private delete(key: string) {
    return this.storage.removeItem(key);
  }

  store(prefix: string, value: string, expires = 40000): string {
    const key = prefix;
    // const key = prefix + Date.now();
    this.storage.setItem(key, value);
    setTimeout(() => this.delete(key), expires);
    return key;
  }

  /**
   * 取得し、消す。
   */
  draw(key: string): string {
    const value: string = this.get(key);
    if (value) {
      this.delete(key);
    }
    return value;
  }

}
