import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { GameRawHeight, GameRawWidth } from "../../constants";
import { CapturePreview } from "../components/fleet-capture/CapturePreview";
import { ExportButton } from "../components/fleet-capture/ExportButton";
import { GridSizeFields } from "../components/fleet-capture/GridSizeFields";
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
  // 切り抜き範囲の調整は撮るたびには要らないため、既定では畳んでおく
  const [adjustingRange, setAdjustingRange] = useState(false);
  const cellAspectRatio = `${GameRawWidth * controller.rect.w} / ${GameRawHeight * controller.rect.h}`;

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">編成キャプチャ</h1>
      <p>
        「編成キャプチャ」とは、艦隊編成画面のスクリーンショットを手動で取得し、統合し、一枚の画像として保存する機能です。
      </p>
      <section className="space-y-2">
        <div className="flex items-end gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-semibold">プリセット</span>
            <PresetSelector
              presets={controller.presets}
              selectedId={controller.activePreset._id!}
              onSelect={controller.selectPreset}
            />
          </label>
          <PresetActionButtons
            modified={controller.modified}
            builtin={controller.activePreset.protected}
            notice={controller.notice}
            onUpdate={controller.updatePreset}
            onSaveAsNew={controller.saveAsNewPreset}
          />
        </div>
        <p className="text-sm text-gray-600">{controller.activePreset.description}</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-bold">キャプチャ</h2>
        <p className="text-sm text-gray-600">
          セルをクリックするとゲーム画面をキャプチャします。撮影済みのセルはクリックで撮り直せます。
        </p>
        <GridSizeFields
          rows={controller.composition.length}
          cols={controller.composition[0]?.length ?? 1}
          onChange={controller.setGridSize}
        />
        {/* 横幅が足りないときはグリッドを切らず、プレビュー側を下へ折り返す */}
        <div className="flex flex-wrap gap-6 items-start">
          <div className="max-w-full overflow-x-auto">
            <ResultGrid
              composition={controller.composition}
              results={controller.results}
              cellAspectRatio={cellAspectRatio}
              onRequestCapture={controller.captureCell}
              onRequestClear={controller.clearCell}
            />
          </div>
          <div className="space-y-2">
            <CapturePreview
              preview={controller.preview}
              rect={controller.rect}
              expanded={adjustingRange}
              onRefresh={controller.refreshPreview}
            />
            <div className="space-y-1">
              <button
                type="button"
                className="flex items-center gap-1 text-gray-700 hover:text-gray-900 cursor-pointer"
                aria-expanded={adjustingRange}
                onClick={() => setAdjustingRange((open) => !open)}
              >
                {adjustingRange ? (
                  <ChevronDownIcon className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4" aria-hidden="true" />
                )}
                切り抜き範囲を調整する
              </button>
              {adjustingRange ? (
                <RangeAdjuster rect={controller.rect} onRectChange={controller.setRect} />
              ) : null}
            </div>
          </div>
        </div>
        <ExportButton disabled={controller.isExportDisabled} onExport={controller.exportResults} />
      </section>
    </div>
  );
}
