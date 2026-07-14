import { useState } from "react";
import { useRevalidator } from "react-router-dom";
import { CapturePreset } from "../../../models/CapturePreset";
import { FleetCaptureConfig, TransparentBackground } from "../../../models/configs/FleetCaptureConfig";
import { Launcher } from "../../../services/Launcher";
import { FoldableSection } from "../FoldableSection";
import { useConfigField } from "./useConfigField";

export function FleetCaptureSettingView({
  presets,
  config,
}: {
  presets: CapturePreset[];
  config: FleetCaptureConfig;
}) {
  const revalidator = useRevalidator();
  const [background, applyBackground] = useConfigField(config, "background", config.background);
  const transparent = background === TransparentBackground;
  // 透明を解除したときに戻す色
  const [lastColor, setLastColor] = useState<string>(transparent ? "#ffffff" : config.background);

  return (
    <FoldableSection title="編成キャプチャの設定" id="fleet-capture">
      <div className="mb-4">
        <h3 className="font-bold">空白セルの背景色</h3>
        <p className="text-sm text-gray-600">エクスポート画像で、キャプチャしていないセルを塗る色です。</p>
        <div className="flex items-center space-x-4 mt-2">
          <input
            type="color"
            value={transparent ? lastColor : background}
            disabled={transparent}
            className={transparent ? "opacity-50" : "cursor-pointer"}
            onChange={(event) => {
              setLastColor(event.target.value);
              void applyBackground(event.target.value);
            }}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={transparent}
              className="w-4 h-4"
              onChange={(event) =>
                void applyBackground(event.target.checked ? TransparentBackground : lastColor)
              }
            />
            <span>透明にする（png保存時のみ有効）</span>
          </label>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-bold mb-2">プリセット</h3>
        {presets.map((preset) => (
          <div key={preset._id} className="border rounded p-2 mb-2 flex items-center">
            <div>
              <h4 className="text-lg">{preset.name}</h4>
              {preset.description ? <p className="text-sm text-gray-600">{preset.description}</p> : null}
            </div>
            <div className="grow"></div>
            <div>
              <button
                className={`border rounded p-2 border-slate-200 bg-slate-100 ${
                  preset.protected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={preset.protected}
                onClick={async () => {
                  if (!window.confirm(`プリセット「${preset.name}」を削除します。よろしいですか？`)) return;
                  await preset.delete();
                  revalidator.revalidate();
                }}
              >削除</button>
            </div>
          </div>
        ))}
        <button
          className="border rounded p-2 cursor-pointer border-slate-200 bg-blue-400"
          onClick={() => Launcher.fleetcapture()}
        >プリセットの追加・編集は編成キャプチャ画面から</button>
      </div>
    </FoldableSection>
  );
}
