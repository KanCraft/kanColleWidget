import { GameWindowConfig } from "../../../models/configs/GameWindowConfig";
import { FoldableSection } from "../FoldableSection";
import { useConfigField } from "./useConfigField";

export function InAppSettingView({
  config,
}: {
  config: GameWindowConfig;
}) {
  const [showMuteButton, saveShowMuteButton] = useConfigField(config, "showMuteButton", config.showMuteButton ?? true);
  const [showScreenshotButton, saveShowScreenshotButton] = useConfigField(
    config,
    "showScreenshotButton",
    config.showScreenshotButton ?? true,
  );
  const [buttonSize, saveButtonSize] = useConfigField(config, "buttonSize", config.buttonSize ?? 50);

  return (
    <FoldableSection title="ウィンドウ内表示設定" id="inapp">
      <div className="mb-4">
        <p>ゲームウィンドウ内に表示されるボタンの設定ができます</p>
      </div>

      <div className="mb-4 flex items-center space-x-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showMuteButton}
            onChange={(e) => void saveShowMuteButton(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="font-bold">ミュートボタンを表示</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showScreenshotButton}
            onChange={(e) => void saveShowScreenshotButton(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="font-bold">スクショボタンを表示</span>
        </label>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <span className="font-bold">表示サイズ</span>
        <span className="text-xs text-gray-500">小</span>
        <input
          type="range"
          min="50"
          max="100"
          step="50"
          value={buttonSize}
          onChange={(e) => void saveButtonSize(Number(e.target.value))}
          className="w-16"
        />
        <span className="text-xs text-gray-500">大</span>
      </div>

      <div className="text-sm text-gray-600 mt-4">
        <div>※ 設定は次回ゲームウィンドウを開く際に反映されます</div>
      </div>
    </FoldableSection>
  );
}
