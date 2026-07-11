import { expect, describe, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// chromite（logger 経由で import される）はモジュール読み込み時に chrome.runtime を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = { runtime: { id: "test", onMessage: { addListener: () => {} } } };
});

import { CustomQueueModal } from "../src/page/components/dashboard/CustomQueueModal";
import { DashboardConfig } from "../src/models/configs/DashboardConfig";
import Queue from "../src/models/Queue";
import { EntryType } from "../src/models/entry";
import { H, M, S } from "../src/utils";

function newQueue(remainMsec: number): Queue {
  return Queue.new({
    type: EntryType.MISSION,
    scheduled: Date.now() + remainMsec,
    params: { deck: 1 },
  });
}

// タイマー手入力欄の形式設定（manualTimerInput）の既定値。
describe("DashboardConfig.manualTimerInput", () => {
  it("既定は split（時・分の分割入力。既存ユーザーの挙動を変えない）", () => {
    expect(new DashboardConfig().manualTimerInput).toBe("split");
    expect(DashboardConfig.default.user.manualTimerInput).toBe("split");
  });
});

// 既定（split）モード: 時・分の分割入力にキーボード操作を足した挙動。
describe("CustomQueueModal (split)", () => {
  it("時ボックスに自動フォーカスされる", () => {
    const queue = newQueue(1 * H + 30 * M);
    render(<CustomQueueModal queue={queue} close={() => {}} update={() => {}} />);
    const [hoursInput] = screen.getAllByRole("spinbutton");
    expect(hoursInput).toHaveFocus();
  });

  it("時・分の変更が scheduled に反映される", () => {
    const queue = newQueue(0);
    render(<CustomQueueModal queue={queue} close={() => {}} update={() => {}} />);
    const [hoursInput, minutesInput] = screen.getAllByRole("spinbutton");
    const before = Date.now();
    fireEvent.change(hoursInput, { target: { value: "2" } });
    fireEvent.change(minutesInput, { target: { value: "45" } });
    expect(queue.scheduled).toBeGreaterThanOrEqual(before + 2 * H + 45 * M);
    expect(queue.scheduled).toBeLessThanOrEqual(Date.now() + 2 * H + 45 * M);
  });

  it("Enter で保存されてモーダルが閉じる", async () => {
    const queue = newQueue(1 * H);
    const close = vi.fn();
    render(<CustomQueueModal queue={queue} close={close} update={() => {}} />);
    const [hoursInput] = screen.getAllByRole("spinbutton");
    fireEvent.keyDown(hoursInput, { key: "Enter" });
    await waitFor(() => expect(close).toHaveBeenCalled());
    expect(await Queue.list()).toHaveLength(1);
  });
});

// 種別切替: params のスロットキー（deck / dock）の引き継ぎ。
describe("CustomQueueModal 種別切替", () => {
  it("dock しか持たないQueue（API傍受由来）を遠征へ切り替えると deck に引き継がれる", () => {
    const queue = Queue.new({ type: EntryType.RECOVERY, scheduled: Date.now(), params: { dock: 3 } });
    render(<CustomQueueModal queue={queue} close={() => {}} update={() => {}} />);
    const [typeSelect] = screen.getAllByRole("combobox");
    fireEvent.change(typeSelect, { target: { value: EntryType.MISSION } });
    expect(queue.params["deck"]).toBe(3);
  });
});

// time モード: HH:MM の time input 1つで入力する。
describe("CustomQueueModal (time)", () => {
  function renderTimeMode(queue: Queue, close: () => void = () => {}) {
    const { container } = render(
      <CustomQueueModal queue={queue} close={close} update={() => {}} manualTimerInput="time" />,
    );
    return container.querySelector<HTMLInputElement>('input[type="time"]')!;
  }

  it("time input が1つ表示され、残り時間が HH:MM で入り、自動フォーカスされる", () => {
    // remain() は floor で丸めるため、描画までの経過時間で分が繰り下がらないよう 30 秒のバッファを足す
    const queue = newQueue(1 * H + 30 * M + 30 * S);
    const input = renderTimeMode(queue);
    expect(input).not.toBeNull();
    expect(input.value).toBe("01:30");
    expect(input).toHaveFocus();
  });

  it("残り24時間以上の queue を開くと 23:59 に丸めて表示する", () => {
    const queue = newQueue(30 * H);
    const input = renderTimeMode(queue);
    expect(input.value).toBe("23:59");
  });

  it("HH:MM の入力が scheduled に反映され、Enter で保存されてモーダルが閉じる", async () => {
    const queue = newQueue(0);
    const close = vi.fn();
    const input = renderTimeMode(queue, close);
    const before = Date.now();
    fireEvent.change(input, { target: { value: "01:30" } });
    expect(queue.scheduled).toBeGreaterThanOrEqual(before + 1 * H + 30 * M);
    expect(queue.scheduled).toBeLessThanOrEqual(Date.now() + 1 * H + 30 * M);
    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() => expect(close).toHaveBeenCalled());
    expect(await Queue.list()).toHaveLength(1);
  });
});
