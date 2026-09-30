import { useState } from "react";
import { CapturePreset } from "../../../models/CapturePreset";
import { FleetCaptureConfig, TransparentBackground } from "../../../models/configs/FleetCaptureConfig";
import { Launcher } from "../../../services/Launcher";
import { FoldableSection } from "../FoldableSection";
import { CapturePresetListView } from "./CapturePresetListView";
import { useConfigField } from "./useConfigField";

export function FleetCaptureSettingView({
  presets,
  config,
}: {
  presets: CapturePreset[];
  config: FleetCaptureConfig;
}) {
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
        <p className="text-sm text-gray-600 mb-2">
          行をドラッグすると並び替えられます。この順序は編成キャプチャ画面の選択肢に反映され、先頭のプリセットが初期選択になります。
        </p>
        <CapturePresetListView presets={presets} />
        <button
          className="border rounded-sm p-2 cursor-pointer border-slate-200 bg-blue-400"
          onClick={() => Launcher.fleetcapture()}
        >プリセットの追加・編集は編成キャプチャ画面から</button>
      </div>
    </FoldableSection>
  );
}
