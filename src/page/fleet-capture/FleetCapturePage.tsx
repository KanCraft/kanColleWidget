import { ExportButton } from "../components/fleet-capture/ExportButton";
import { ResultGrid } from "../components/fleet-capture/ResultGrid";
import { UsecaseSelector } from "../components/fleet-capture/UsecaseSelector";
import { useFleetCapture } from "./useFleetCapture";
import { usecases } from "./usecases";

export function FleetCapturePage() {
  const controller = useFleetCapture({
    availableUsecases: usecases,
    initialUsecase: usecases[0],
  });

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">艦隊キャプチャ</h1>
      <p>
        「編成キャプチャ」とは、艦隊編成画面のスクリーンショットを手動で取得し、統合し、一枚の画像として保存する機能です。
      </p>
      <section className="space-y-2">
        <label className="flex flex-col gap-2">
          <span className="font-semibold">キャプチャ種別</span>
          <UsecaseSelector
            usecases={controller.availableUsecases}
            selectedId={controller.activeUsecase.id}
            onSelect={controller.selectUsecase}
          />
        </label>
        <p className="text-sm text-gray-600">{controller.activeUsecase.description}</p>
      </section>
      <ResultGrid
        usecase={controller.activeUsecase}
        results={controller.results}
        onRequestCapture={controller.captureCell}
      />
      <ExportButton disabled={controller.isExportDisabled} onExport={controller.exportResults} />
    </div>
  );
}
