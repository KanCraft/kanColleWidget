import { expect, describe, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

// NotificationConfig の static default が chrome.runtime.getURL を参照するため、import より前にスタブする
vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).chrome = {
    runtime: { id: "test", onMessage: { addListener: () => {} }, getURL: (p: string) => p },
  };
});

import { NotificationSettingView } from "../src/page/components/options/NotificationSettingView";
import { MISSION_REMIND_CONFIG_KEY, NotificationConfig } from "../src/models/configs/NotificationConfig";
import { BehaviorConfig } from "../src/models/configs/BehaviorConfig";
import { EntryType, NotificationId, TIMER_ENTRY_TYPES, TriggerType } from "../src/models/entry";
import { restoreDefaultsBeforeEach } from "./helpers/jstorm-defaults";

restoreDefaultsBeforeEach(NotificationConfig);
restoreDefaultsBeforeEach(BehaviorConfig);

async function pair(type: string) {
  return {
    [TriggerType.START]: (await NotificationConfig.find(NotificationId.configKey(type, TriggerType.START)))!,
    [TriggerType.END]: (await NotificationConfig.find(NotificationId.configKey(type, TriggerType.END)))!,
  };
}

async function renderView() {
  const entries = Object.fromEntries(await Promise.all(TIMER_ENTRY_TYPES.map(async (t) => [t, await pair(t)])));
  const view = (
    <NotificationSettingView
      defaults={await pair(EntryType.TEST_DEFAULT)}
      entries={{ ...entries, [EntryType.UNKNOWN]: await pair(EntryType.TEST_DEFAULT) } as never}
      missionRemind={(await NotificationConfig.find(MISSION_REMIND_CONFIG_KEY))!}
      behavior={await BehaviorConfig.user()}
    />
  );
  const router = createMemoryRouter([{ path: "/", element: view }], { initialEntries: ["/?open=notifications"] });
  render(<RouterProvider router={router} />);
}

// 遠征帰投予告（#935）の設定枠。既定は無効で、分数は BehaviorConfig に保存する。
describe("NotificationSettingView 遠征帰投予告", () => {
  const remindBox = () => screen.getByText("遠征 帰投予告").closest("div.border")! as HTMLElement;

  it("遠征の行に帰投予告の枠があり、既定は無効・3分前", async () => {
    await renderView();
    expect(within(remindBox()).getByRole("checkbox")).not.toBeChecked();
    expect(within(remindBox()).getByRole("combobox")).toHaveValue("3");
  });

  it("有効化と分数の変更が保存される", async () => {
    await renderView();
    await userEvent.click(within(remindBox()).getByRole("checkbox"));
    await userEvent.selectOptions(within(remindBox()).getByRole("combobox"), "10");
    expect((await NotificationConfig.find(MISSION_REMIND_CONFIG_KEY))!.enabled).toBe(true);
    expect((await BehaviorConfig.user()).missionRemindMinutes).toBe(10);
  });

  it("「通知を使用する」の一括 OFF で帰投予告も無効になる", async () => {
    await NotificationConfig.new({ enabled: true, sound: null, icon: null, stay: false }, MISSION_REMIND_CONFIG_KEY).save();
    await renderView();
    await userEvent.click(screen.getByRole("checkbox", { name: /通知を使用する/ }));
    expect((await NotificationConfig.find(MISSION_REMIND_CONFIG_KEY))!.enabled).toBe(false);
  });
});
