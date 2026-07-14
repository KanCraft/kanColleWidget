import { DashboardConfig } from "../../../models/configs/DashboardConfig";
import { FoldableSection } from "../FoldableSection";
import { useConfigField } from "./useConfigField";

export function DashboardSettingView({
  config,
}: {
  config: DashboardConfig;
}) {
  const [openWithGame, saveOpenWithGame] = useConfigField(config, "openWithGame", config.openWithGame ?? false);
  const [manualTimerInput, saveManualTimerInput] = useConfigField(
    config,
    "manualTimerInput",
    config.manualTimerInput ?? "split",
  );
  const [width, saveWidth] = useConfigField(config, "width", config.width, {
    normalize: (v) => (Number.isFinite(v) ? Math.trunc(v) : 600),
  });
  const [height, saveHeight] = useConfigField(config, "height", config.height, {
    normalize: (v) => (Number.isFinite(v) ? Math.trunc(v) : 400),
  });
  const [left, saveLeft] = useConfigField(config, "left", config.left, {
    normalize: (v) => (Number.isFinite(v) ? Math.trunc(v) : 100),
  });
  const [top, saveTop] = useConfigField(config, "top", config.top, {
    normalize: (v) => (Number.isFinite(v) ? Math.trunc(v) : 100),
  });

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
            onChange={(e) => void saveOpenWithGame(e.target.checked)}
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
            value={width}
            onChange={(e) => void saveWidth(parseInt(e.target.value, 10))}
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
            value={height}
            onChange={(e) => void saveHeight(parseInt(e.target.value, 10))}
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
            value={left}
            onChange={(e) => void saveLeft(parseInt(e.target.value, 10))}
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
            value={top}
            onChange={(e) => void saveTop(parseInt(e.target.value, 10))}
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
              onChange={() => void saveManualTimerInput("split")}
              className="w-4 h-4"
            />
            <span>時間と分を分けて入力</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="manual-timer-input"
              checked={manualTimerInput === "time"}
              onChange={() => void saveManualTimerInput("time")}
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
