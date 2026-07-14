import { expect, describe, it } from "vitest";

import { Logbook, SortieContext } from "../src/models/Logbook";
import { BehaviorConfig } from "../src/models/configs/BehaviorConfig";
import { restoreDefaultsBeforeEach } from "./helpers/jstorm-defaults";

const DAY_MS = 24 * 60 * 60 * 1000;

restoreDefaultsBeforeEach(BehaviorConfig);

async function saveSortieAt(id: string, started: number): Promise<void> {
  const ctx = new SortieContext();
  ctx._id = id;
  ctx.started = started;
  await ctx.save();
}

// 出撃記録（Logbook）の保存期間の自動確定と、期限切れ記録の削除ルール。
describe("Logbook 保存期間の自動確定", () => {
  it("出撃記録が無い状態で record() すると既定の7日として確定保存される", async () => {
    Logbook.sortie.start("1", { area: "1", info: "1" });
    await Logbook.record();

    const config = await BehaviorConfig.user();
    expect(config.logbookRetentionDays).toBe(7);
  });

  it("既存の出撃記録がある状態で record() すると無期限(0)として確定保存される", async () => {
    await saveSortieAt("existing", Date.now() - 400 * DAY_MS);

    Logbook.sortie.start("1", { area: "1", info: "1" });
    await Logbook.record();

    const config = await BehaviorConfig.user();
    expect(config.logbookRetentionDays).toBe(0);
    // 無期限なので古い記録も残っている
    const ids = (await Logbook.list()).map((s) => s._id);
    expect(ids).toContain("existing");
  });

  it("一度確定した保存期間は既存記録の増減に関わらず変わらない", async () => {
    Logbook.sortie.start("1", { area: "1", info: "1" });
    await Logbook.record(); // ここで7日に確定

    Logbook.sortie.start("2", { area: "1", info: "1" });
    await Logbook.record();

    const config = await BehaviorConfig.user();
    expect(config.logbookRetentionDays).toBe(7);
  });
});

describe("Logbook 期限切れ記録の削除", () => {
  it("保存期間より古い記録は record() 実行時に削除され、期間内の記録は残る", async () => {
    const config = await BehaviorConfig.user();
    await config.update({ logbookRetentionDays: 7 });

    await saveSortieAt("old", Date.now() - 8 * DAY_MS);
    await saveSortieAt("recent", Date.now() - 1 * DAY_MS);

    Logbook.sortie.start("1", { area: "1", info: "1" });
    await Logbook.record();

    const ids = (await Logbook.list()).map((s) => s._id);
    expect(ids).not.toContain("old");
    expect(ids).toContain("recent");
  });

  it("保存期間が0（無期限）なら古い記録も削除されない", async () => {
    const config = await BehaviorConfig.user();
    await config.update({ logbookRetentionDays: 0 });

    await saveSortieAt("ancient", Date.now() - 1000 * DAY_MS);

    Logbook.sortie.start("1", { area: "1", info: "1" });
    await Logbook.record();

    const ids = (await Logbook.list()).map((s) => s._id);
    expect(ids).toContain("ancient");
  });
});
