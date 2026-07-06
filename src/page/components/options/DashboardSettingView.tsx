import { useState } from "react";
import { DashboardConfig, ManualTimerInputStyle } from "../../../models/configs/DashboardConfig";
import { FoldableSection } from "../FoldableSection";

export function DashboardSettingView({
  config: _config,
}: {
  config: DashboardConfig;
}) {
  const [config] = useState<DashboardConfig>(_config);
  const [openWithGame, setOpenWithGame] = useState<boolean>(config.openWithGame ?? false);
  const [manualTimerInput, setManualTimerInput] = useState<ManualTimerInputStyle>(config.manualTimerInput ?? "split");

  const selectManualTimerInput = async (style: ManualTimerInputStyle) => {
    await config.update({ manualTimerInput: style });
    setManualTimerInput(style);
  };

  return (
    <FoldableSection title="ダッシュボードの設定" id="dashboard">
      <div className="mb-4">
        <p>ダッシュボード窓を開く際のサイズと位置を設定できます.</p>
      </div>

      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={openWithGame}
            onChange={async (e) => {
              const next = e.target.checked;
              await config.update({ openWithGame: next });
              setOpenWithGame(next);
            }}
            className="w-4 h-4"
          />
          <span className="font-bold">ゲーム起動と同時にダッシュボードを開く</span>
        </label>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 max-w-md">
        <div>
          <label className="block mb-2">
            <span className="font-bold">横幅 (px)</span>
          </label>
          <input
            type="number"
            defaultValue={config.width}
            onChange={async (e) => {
              await config.update({ width: parseInt(e.target.value, 10) });
            }}
            className="border rounded p-2 w-full"
            placeholder="600"
            min="200"
          />
        </div>

        <div>
          <label className="block mb-2">
            <span className="font-bold">縦幅 (px)</span>
          </label>
          <input
            type="number"
            defaultValue={config.height}
            onChange={async (e) => {
              await config.update({ height: parseInt(e.target.value, 10) });
            }}
            className="border rounded p-2 w-full"
            placeholder="400"
            min="150"
          />
        </div>

        <div>
          <label className="block mb-2">
            <span className="font-bold">左位置 (px)</span>
          </label>
          <input
            type="number"
            defaultValue={config.left}
            onChange={async (e) => {
              await config.update({ left: parseInt(e.target.value, 10) });
            }}
            className="border rounded p-2 w-full"
            placeholder="100"
          />
        </div>

        <div>
          <label className="block mb-2">
            <span className="font-bold">上位置 (px)</span>
          </label>
          <input
            type="number"
            defaultValue={config.top}
            onChange={async (e) => {
              await config.update({ top: parseInt(e.target.value, 10) });
            }}
            className="border rounded p-2 w-full"
            placeholder="100"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        <div>※ サイズと位置は次回ダッシュボードを開く際に反映されます</div>
      </div>

      <div className="mb-4">
        <div className="font-bold mb-1">タイマー手入力欄の形式</div>
        <div className="flex space-x-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="manual-timer-input"
              checked={manualTimerInput === "split"}
              onChange={() => selectManualTimerInput("split")}
              className="w-4 h-4"
            />
            <span>時間と分を分けて入力</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="manual-timer-input"
              checked={manualTimerInput === "time"}
              onChange={() => selectManualTimerInput("time")}
              className="w-4 h-4"
            />
            <span>HH:MM 形式でまとめて入力</span>
          </label>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          HH:MM 形式はキーボードで「0130」と打つと 01:30 を入力でき、Enter で保存します。入力できるのは 23:59 まで。24時間以上のタイマーは「時間と分を分けて入力」を使ってください。
        </div>
      </div>

    </FoldableSection>
  );
}
