import { expect, describe, it } from "vitest";

import { installMemoryStorage } from "jstorm/testing";

import { GameWindowRegistry } from "../src/services/GameWindowRegistry";

// GameWindowRegistry（#1848）: 「確実に自分が開いた窓」の証跡として windowId を
// chrome.storage.session 相当のストレージへ記録・破棄・参照できることを検証する。
describe("GameWindowRegistry", () => {
  it("remember した windowId を current で取り出せる", async () => {
    const registry = new GameWindowRegistry(installMemoryStorage());

    await registry.remember(42);

    expect(await registry.current()).toBe(42);
  });

  it("記録が無ければ current は undefined を返す", async () => {
    const registry = new GameWindowRegistry(installMemoryStorage());

    expect(await registry.current()).toBeUndefined();
  });

  it("forget は一致する windowId のときだけ記録を消す", async () => {
    const registry = new GameWindowRegistry(installMemoryStorage());
    await registry.remember(42);

    await registry.forget(99); // 別の windowId → 何もしない
    expect(await registry.current()).toBe(42);

    await registry.forget(42); // 一致 → 消える
    expect(await registry.current()).toBeUndefined();
  });

  it("remember で上書きすると最新の windowId だけが残る", async () => {
    const registry = new GameWindowRegistry(installMemoryStorage());

    await registry.remember(1);
    await registry.remember(2);

    expect(await registry.current()).toBe(2);
  });
});
