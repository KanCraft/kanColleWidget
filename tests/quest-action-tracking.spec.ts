import { expect, describe, it, vi } from "vitest";

// quest.ts が NotificationConfig 経由で chrome.runtime.getURL を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", getURL: (path: string) => `chrome-extension://test/${path}` },
  };
});

import { onQuestStart, onQuestStop, onQuestComplete } from "../src/controllers/WebRequest/quest";
import { QuestProgress, QuestStatus } from "../src/models/QuestProgress";

// api_req_quest/{start,stop,clearitemget} の formData から任務IDを取り出し、
// QuestProgress へ反映できているかを検証する（連鎖解放そのものは quest-progress.spec.ts 側で検証済み）。
const details = (questId: number) =>
  [{ requestBody: { formData: { api_quest_id: [String(questId)] } } }] as unknown as chrome.webRequest.OnBeforeRequestDetails[];

describe("onQuestStart", () => {
  it("formDataのapi_quest_idが示す任務をONGOINGにする", async () => {
    await onQuestStart(details(303));
    const progress = await QuestProgress.user();
    expect(progress.statuses[303]).toBe(QuestStatus.ONGOING);
  });
});

describe("onQuestStop", () => {
  it("formDataのapi_quest_idが示す任務をOPENに戻す", async () => {
    await onQuestStart(details(303));
    await onQuestStop(details(303));
    const progress = await QuestProgress.user();
    expect(progress.statuses[303]).toBe(QuestStatus.OPEN);
  });
});

describe("onQuestComplete", () => {
  it("formDataのapi_quest_idが示す任務をCOMPLETEDにし、後続任務を解放する", async () => {
    await onQuestComplete(details(303));
    const progress = await QuestProgress.user();
    expect(progress.statuses[303]).toBe(QuestStatus.COMPLETED);
    expect(progress.statuses[304]).toBe(QuestStatus.OPEN);
  });
});
