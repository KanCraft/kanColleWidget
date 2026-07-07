import { useState } from "react";
import { GameRawHeight, GameRawWidth } from "../../constants";
import { CapturePreviewThumbnail } from "../components/fleet-capture/CapturePreviewThumbnail";
import { ExportButton } from "../components/fleet-capture/ExportButton";
import { PresetActionButtons } from "../components/fleet-capture/PresetActionButtons";
import { PresetSelector } from "../components/fleet-capture/PresetSelector";
import { RangeAdjuster } from "../components/fleet-capture/RangeAdjuster";
import { ResultGrid } from "../components/fleet-capture/ResultGrid";
import { useFleetCapture } from "./useFleetCapture";
import { fleetcapture } from "../loader";
import { useTypedLoaderData } from "../loader/useTypedLoaderData";

export function FleetCapturePage() {
  const { presets } = useTypedLoaderData<typeof fleetcapture>();
  const controller = useFleetCapture({ presets });
  // 調整モード（切り抜き範囲・グリッド構成・プリセットの編集）とキャプチャモードの切り替え
  const [adjusting, setAdjusting] = useState(false);
  const cellAspectRatio = `${GameRawWidth * controller.rect.w} / ${GameRawHeight * controller.rect.h}`;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">編成キャプチャ</h1>
      <p>
        「編成キャプチャ」とは、艦隊編成画面のスクリーンショットを手動で取得し、統合し、一枚の画像として保存する機能です。
      </p>
      <section className="space-y-2">
        <label className="flex flex-col gap-2">
          <span className="font-semibold">プリセット</span>
          <PresetSelector
            presets={controller.presets}
            selectedId={controller.activePreset._id!}
            onSelect={controller.selectPreset}
          />
        </label>
        <p className="text-sm text-gray-600">{controller.activePreset.description}</p>
      </section>
      {adjusting ? (
        <section className="space-y-2">
          <h2 className="text-xl font-bold">切り抜き範囲の調整</h2>
          <RangeAdjuster
            preview={controller.preview}
            rect={controller.rect}
            rows={controller.composition.length}
            cols={controller.composition[0]?.length ?? 1}
            onRectChange={controller.setRect}
            onGridSizeChange={controller.setGridSize}
            onRefreshPreview={controller.refreshPreview}
          />
          <div className="flex items-center space-x-2">
            <PresetActionButtons
              canUpdate={!controller.activePreset.protected && controller.modified}
              canDelete={!controller.activePreset.protected}
              onUpdate={controller.updatePreset}
              onSaveAsNew={controller.saveAsNewPreset}
              onDelete={controller.deletePreset}
            />
            <button
              type="button"
              className="border rounded p-2 cursor-pointer border-slate-200 bg-blue-400 text-white"
              onClick={() => setAdjusting(false)}
            >
              キャプチャに戻る
            </button>
          </div>
        </section>
      ) : (
        <section className="space-y-2">
          <h2 className="text-xl font-bold">キャプチャ</h2>
          <p className="text-sm text-gray-600">
            セルをクリックするとゲーム画面をキャプチャします。撮影済みのセルはクリックで撮り直せます。
          </p>
          <div className="flex gap-6 items-start">
            <ResultGrid
              composition={controller.composition}
              results={controller.results}
              cellAspectRatio={cellAspectRatio}
              onRequestCapture={controller.captureCell}
              onRequestClear={controller.clearCell}
            />
            {controller.preview ? (
              <CapturePreviewThumbnail preview={controller.preview} rect={controller.rect} />
            ) : null}
          </div>
          <div className="flex items-center space-x-4">
            <ExportButton disabled={controller.isExportDisabled} onExport={controller.exportResults} />
            <button
              type="button"
              className="mt-4 border rounded p-2 cursor-pointer border-slate-200 bg-slate-100"
              onClick={() => setAdjusting(true)}
            >
              切り抜き範囲を調整する
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
