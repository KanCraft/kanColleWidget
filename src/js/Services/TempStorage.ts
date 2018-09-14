
export default class TempStorage {

  constructor(private storage: Storage = localStorage) {}

  public store(prefix: string, value: string): string {
    const key = prefix + Date.now();
    this.storage.setItem(key, value);
    return key;
  }

  /**
   * 取得し、消す。
   */
  public draw(key: string): string {
    const value: string = this.get(key);
    this.delete(key);
    return value;
  }

  private get(key: string): string {
    return this.storage.getItem(key);
  }

  private delete(key: string) {
    return this.storage.removeItem(key);
  }

}
