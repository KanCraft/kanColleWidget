import { expect, describe, it } from "vitest";

import { installMemoryStorage } from "jstorm/testing";

import { TempStorage } from "../src/services/TempStorage";

// TempStorage（撮影画像などの一時受け渡し用ストレージ）の
// 保存・取り出しと同時の削除・期限切れの扱いを検証する。
describe("TempStorage", () => {
  it("store した値を draw で取り出せて、取り出しと同時に削除される", async () => {
    const temp = new TempStorage(installMemoryStorage());

    const key = await temp.store("capture_1", "data:image/png;base64,xxxx");

    expect(await temp.draw(key)).toBe("data:image/png;base64,xxxx");
    expect(await temp.draw(key)).toBeUndefined();
  });

  it("期限切れのエントリは draw で取り出せない", async () => {
    const temp = new TempStorage(installMemoryStorage());

    const key = await temp.store("capture_1", "value", -1);

    expect(await temp.draw(key)).toBeUndefined();
  });

  it("store のたびに期限切れの残骸を掃除し、TempStorage 以外のキーには触らない", async () => {
    const area = installMemoryStorage({
      "TempStorage:stale": { value: "old", expires: 0 },
      "FileSaveConfig": { user: { folder: "艦これ" } },
    });
    const temp = new TempStorage(area);

    await temp.store("capture_2", "new");

    const all = await area.get(null);
    expect(all["TempStorage:stale"]).toBeUndefined();
    expect(all["FileSaveConfig"]).toEqual({ user: { folder: "艦これ" } });
    expect(all["TempStorage:capture_2"]).toMatchObject({ value: "new" });
  });
});
