import { expect, describe, it } from "vitest";

import { missions } from "../src/catalog";
import { Fatigue, Mission, Recovery, Shipbuild, TriggerType } from "../src/models/entry";

// 通知IDは /{type}/{trigger}/{deck|dock} 形式（CLAUDE.md「通知ID規約」）。
// WebRequest 側の消去処理はこの形式への prefix/suffix 照合に依存しているため、形式を契約として固定する。
describe("通知IDの形式", () => {
  it("Mission は /mission/{trigger}/{deck}", () => {
    const mission = new Mission("2", 5, missions["5"]);
    expect(mission.$n.id(TriggerType.START)).toBe("/mission/start/2");
    expect(mission.$n.id(TriggerType.END)).toBe("/mission/end/2");
  });

  it("Recovery は /recovery/{trigger}/{dock}", () => {
    const recovery = new Recovery(1, 30 * 60 * 1000);
    expect(recovery.$n.id(TriggerType.START)).toBe("/recovery/start/1");
    expect(recovery.$n.id(TriggerType.END)).toBe("/recovery/end/1");
  });

  it("Shipbuild は /shipbuild/{trigger}/{dock}", () => {
    const shipbuild = new Shipbuild(3, 60 * 60 * 1000);
    expect(shipbuild.$n.id(TriggerType.START)).toBe("/shipbuild/start/3");
    expect(shipbuild.$n.id(TriggerType.END)).toBe("/shipbuild/end/3");
  });

  it("Fatigue は /fatigue/{trigger}/{deck}", () => {
    const fatigue = new Fatigue(4, { area: 1, info: 1 });
    expect(fatigue.$n.id(TriggerType.END)).toBe("/fatigue/end/4");
  });
});
