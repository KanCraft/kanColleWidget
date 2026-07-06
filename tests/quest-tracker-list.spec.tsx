import { expect, describe, it, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// QuestTrackerList が chrome.storage.onChanged を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    storage: { onChanged: { addListener: vi.fn(), removeListener: vi.fn() } },
  };
});

import { QuestTrackerList } from "../src/page/components/quest-tracker/QuestTrackerList";
import { QuestProgress, QuestStatus } from "../src/models/QuestProgress";

const addListener = chrome.storage.onChanged.addListener as unknown as ReturnType<typeof vi.fn>;

// jstorm はストレージが空の間 static default オブジェクトをそのまま返し、update() はそのオブジェクトへ
// 書き込む。テスト間の汚染を防ぐため毎回復元する。
const pristineDefaults = structuredClone(QuestProgress.default);
beforeEach(() => {
  QuestProgress.default = structuredClone(pristineDefaults);
  addListener.mockClear();
});

describe("QuestTrackerList", () => {
  it("その日見えている任務を一覧表示する", async () => {
    const progress = await QuestProgress.user();
    render(<QuestTrackerList progress={progress} onChanged={() => {}} />);
    expect(screen.getByText("「演習」で練度向上！")).toBeInTheDocument();
    expect(screen.getByText("敵艦隊を撃破せよ！")).toBeInTheDocument();
  });

  it("LOCKEDな任務（前提未達成）は表示されない", async () => {
    const progress = await QuestProgress.user();
    render(<QuestTrackerList progress={progress} onChanged={() => {}} />);
    expect(screen.queryByText("「演習」で他提督を圧倒せよ！")).not.toBeInTheDocument(); // 304はrequires:[303]
  });

  it("状態ボタンをクリックすると手動変更モーダルが開く", async () => {
    const user = userEvent.setup();
    const progress = await QuestProgress.user();
    render(<QuestTrackerList progress={progress} onChanged={() => {}} />);

    const row = screen.getByText("「演習」で練度向上！").closest("div")!;
    await user.click(within(row).getByText("未着手"));

    // モーダル内にも同じ任務名が再掲される
    expect(screen.getAllByText("「演習」で練度向上！").length).toBeGreaterThan(1);
    expect(screen.getByRole("button", { name: "遂行中" })).toBeInTheDocument();
  });

  it("モーダルで状態を選ぶと着手状況が更新されonChangedが呼ばれる", async () => {
    const user = userEvent.setup();
    const progress = await QuestProgress.user();
    const onChanged = vi.fn();
    render(<QuestTrackerList progress={progress} onChanged={onChanged} />);

    const row = screen.getByText("「演習」で練度向上！").closest("div")!;
    await user.click(within(row).getByText("未着手"));
    await user.click(screen.getByRole("button", { name: "遂行中" }));

    expect(progress.statuses[303]).toBe(QuestStatus.ONGOING);
    expect(onChanged).toHaveBeenCalledOnce();
  });

  it("「閉じる」を押すとモーダルが閉じる", async () => {
    const user = userEvent.setup();
    const progress = await QuestProgress.user();
    render(<QuestTrackerList progress={progress} onChanged={() => {}} />);

    const row = screen.getByText("「演習」で練度向上！").closest("div")!;
    await user.click(within(row).getByText("未着手"));
    await user.click(screen.getByRole("button", { name: "閉じる" }));

    expect(screen.getAllByText("「演習」で練度向上！")).toHaveLength(1);
  });
});

// 他タブ・ダッシュボード・バックグラウンド側での着手/達成を、ポーリングではなく
// chrome.storage.onChanged で検知して反映する（更新ボタンやインターバルに頼らない）。
describe("chrome.storage.onChangedによるリアルタイム更新", () => {
  it("QuestProgressの変更を検知するとonChangedを呼ぶ", async () => {
    const progress = await QuestProgress.user();
    const onChanged = vi.fn();
    render(<QuestTrackerList progress={progress} onChanged={onChanged} />);

    const listener = addListener.mock.calls[0][0];
    listener({ QuestProgress: { newValue: {} } }, "local");

    expect(onChanged).toHaveBeenCalledOnce();
  });

  it("QuestProgress以外の変更やlocal以外の領域では反応しない", async () => {
    const progress = await QuestProgress.user();
    const onChanged = vi.fn();
    render(<QuestTrackerList progress={progress} onChanged={onChanged} />);

    const listener = addListener.mock.calls[0][0];
    listener({ NotificationConfig: { newValue: {} } }, "local");
    listener({ QuestProgress: { newValue: {} } }, "sync");

    expect(onChanged).not.toHaveBeenCalled();
  });
});
