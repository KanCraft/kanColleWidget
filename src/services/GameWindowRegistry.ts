// chrome.storage.session と同じ非同期サーフェスのうち GameWindowRegistry が使う部分。
// テストでは jstorm/testing の MemoryStorageArea を注入する
interface StorageAreaLike {
  get(keys?: string | string[] | null): Promise<Record<string, unknown>>;
  set(items: Record<string, unknown>): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
}

/**
 * 艦これウィジェットが開いたゲーム別窓の windowId を chrome.storage.session に記録し、
 * 「これは確実に自分が開いた窓である」という強い所有権の証跡として使う（#1848）。
 * URL/tabId 一致だけのヒューリスティック（Launcher.find()）は他のKanColle補助拡張機能が
 * 同じURLの窓を開くケースと区別できないため、記録があればそちらを優先する。
 * chrome.storage.session は Service Worker の再起動を跨いで残るが、ブラウザ終了で消える
 * 揮発ストレージなので、記録が無い場合は Launcher.find() のヒューリスティックへフォールバックする
 * （0001-game-window-resize-on-reload.md が将来課題として明記していた方式）。
 */
export class GameWindowRegistry {

  private static readonly KEY = "GameWindowRegistry:windowId";

  // storage は既定値を持たず、実際に使うメソッド呼び出し時にだけ chrome.storage.session を
  // 参照する（他サービスと同様 Launcher がデフォルト引数で本クラスを生成するため、storage を
  // 参照しないテストで chrome.storage 未スタブでも構築だけなら壊れないようにする）
  constructor(
        private readonly storage?: StorageAreaLike,
  ) { }

  private area(): StorageAreaLike {
    return this.storage ?? chrome.storage.session;
  }

  /**
   * 新規作成したゲーム別窓の windowId を記録する。
   * @param windowId 記録対象の windowId
   */
  public async remember(windowId: number): Promise<void> {
    await this.area().set({ [GameWindowRegistry.KEY]: windowId });
  }

  /**
   * 記録済みの windowId が一致する場合のみ記録を消す（他の窓に上書きされていたら何もしない）。
   * @param windowId 破棄対象の windowId
   */
  public async forget(windowId: number): Promise<void> {
    const current = await this.current();
    if (current === windowId) await this.area().remove(GameWindowRegistry.KEY);
  }

  /**
   * 記録済みの windowId を返す。記録が無ければ undefined。
   */
  public async current(): Promise<number | undefined> {
    const items = await this.area().get(GameWindowRegistry.KEY);
    return items[GameWindowRegistry.KEY] as number | undefined;
  }
}
