import { expect, describe, it } from "vitest";

import { missions } from "../src/catalog";
import { Fatigue, Mission, NotificationId, Recovery, Shipbuild, TriggerType } from "../src/models/entry";

// NotificationId は通知ID /{type}/{trigger}/{target} と設定キー /{type}/{trigger} の唯一のコーデック。
// 生成文字列は保存済み設定・表示中の通知の照合に使われるため、byte 単位で契約を固定する。
describe("NotificationId コーデック", () => {
  describe("build", () => {
    it("通知ID /{type}/{trigger}/{target} を組み立てる", () => {
      expect(NotificationId.build("mission", TriggerType.END, "2")).toBe("/mission/end/2");
      expect(NotificationId.build("shipbuild", TriggerType.START, 3)).toBe("/shipbuild/start/3");
    });

    it("各 entry クラスの $n.id と byte 同一の文字列を返す", () => {
      const mission = new Mission("2", 5, missions["5"]);
      expect(NotificationId.build("mission", TriggerType.START, "2")).toBe(mission.$n.id(TriggerType.START));
      expect(NotificationId.build("mission", TriggerType.END, "2")).toBe(mission.$n.id(TriggerType.END));

      const recovery = new Recovery(1, 0);
      expect(NotificationId.build("recovery", TriggerType.END, 1)).toBe(recovery.$n.id(TriggerType.END));

      const shipbuild = new Shipbuild(3, 0);
      expect(NotificationId.build("shipbuild", TriggerType.END, 3)).toBe(shipbuild.$n.id(TriggerType.END));

      const fatigue = new Fatigue(4, { area: 1, info: 1 });
      expect(NotificationId.build("fatigue", TriggerType.END, 4)).toBe(fatigue.$n.id(TriggerType.END));
    });
  });

  describe("configKey", () => {
    it("設定レコードキー /{type}/{trigger} を byte 同一で組み立てる", () => {
      expect(NotificationId.configKey("mission", TriggerType.START)).toBe("/mission/start");
      expect(NotificationId.configKey("fatigue", TriggerType.END)).toBe("/fatigue/end");
      // EntryType 外のキーも通す
      expect(NotificationId.configKey("default", TriggerType.END)).toBe("/default/end");
      expect(NotificationId.configKey("quest-alert", TriggerType.START)).toBe("/quest-alert/start");
    });
  });

  describe("parse", () => {
    it("通知ID（3セグメント）を type/trigger/target に分解する", () => {
      expect(NotificationId.parse("/mission/end/2")).toEqual({ type: "mission", trigger: "end", target: "2" });
    });

    it("設定キー（2セグメント）は target を持たない", () => {
      expect(NotificationId.parse("/quest-alert/start")).toEqual({ type: "quest-alert", trigger: "start" });
      expect(NotificationId.parse("/default/end")).toEqual({ type: "default", trigger: "end" });
    });

    it("build の結果を parse で往復できる", () => {
      const id = NotificationId.build("mission", TriggerType.END, "2");
      expect(NotificationId.parse(id)).toEqual({ type: "mission", trigger: "end", target: "2" });
    });

    it("/{type}/{trigger} 未満の不正な形式は null", () => {
      expect(NotificationId.parse("")).toBeNull();
      expect(NotificationId.parse("/")).toBeNull();
      expect(NotificationId.parse("/mission")).toBeNull(); // trigger が無い
      expect(NotificationId.parse("mission/end")).toBeNull(); // 先頭が / で始まらない
      expect(NotificationId.parse("//end")).toBeNull(); // type が空
    });
  });

  describe("matches", () => {
    it("type だけの条件は type セグメントの一致で判定する", () => {
      expect(NotificationId.matches("/recovery/start/1", { type: "recovery" })).toBe(true);
      expect(NotificationId.matches("/recovery/end/2", { type: "recovery" })).toBe(true);
      expect(NotificationId.matches("/mission/start/1", { type: "recovery" })).toBe(false);
    });

    it("type と target の条件は両セグメントの一致で判定する（trigger は不問）", () => {
      expect(NotificationId.matches("/mission/end/2", { type: "mission", target: "2" })).toBe(true);
      expect(NotificationId.matches("/mission/start/2", { type: "mission", target: "2" })).toBe(true);
      expect(NotificationId.matches("/mission/end/3", { type: "mission", target: "2" })).toBe(false);
    });

    it("target はセグメント完全一致で、部分一致では誤マッチしない", () => {
      // target "1" が "/mission/end/11" に誤マッチしないこと
      expect(NotificationId.matches("/mission/end/11", { type: "mission", target: "1" })).toBe(false);
      expect(NotificationId.matches("/mission/end/1", { type: "mission", target: "1" })).toBe(true);
    });

    it("不正な形式の通知IDにはどの条件でも一致しない", () => {
      expect(NotificationId.matches("/mission", { type: "mission" })).toBe(false);
      expect(NotificationId.matches("", { type: "mission" })).toBe(false);
    });
  });
});
