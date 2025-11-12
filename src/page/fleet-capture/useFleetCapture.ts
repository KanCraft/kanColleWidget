import { useCallback, useMemo, useState } from "react";
import { CropService } from "../../services/CropService";
import { DownloadService } from "../../services/DownloadService";
import { Launcher } from "../../services/Launcher";
import { WorkerImage } from "../../utils";
import { Logger } from "../../logger";
import {
  createEmptyResultSet,
  type FleetCaptureController,
  type ResultSet,
  type Usecase,
} from "./types";
import { FileSaveConfig } from "../../models/configs/FileSaveConfig";

interface UseFleetCaptureOptions {
  availableUsecases: Usecase[];
  initialUsecase: Usecase;
}

export function useFleetCapture({
  availableUsecases,
  initialUsecase,
}: UseFleetCaptureOptions): FleetCaptureController {
  const log = Logger.get("FleetCapture");
  const [activeUsecase, setActiveUsecase] = useState<Usecase>(initialUsecase);
  const [results, setResults] = useState<ResultSet>(
    createEmptyResultSet(initialUsecase.composition),
  );

  const selectUsecase = useCallback(
    (usecaseId: string) => {
      const selected = availableUsecases.find((candidate) => candidate.id === usecaseId);
      if (!selected) return;
      setActiveUsecase(selected);
      setResults(createEmptyResultSet(selected.composition));
    },
    [availableUsecases],
  );

  const captureCell = useCallback(
    async (rowIndex: number, colIndex: number) => {
      const launcher = new Launcher();
      const win = await launcher.find();
      if (!win) {
        alert("ゲームウィンドウを検出できませんでした。");
        return;
      }
      const whole = await launcher.capture(win.id!);
      const workerImage = await WorkerImage.from(whole);
      const cropper = new CropService(workerImage);
      const cropped = await cropper.crop(activeUsecase.crop);
      setResults((prev) => updateResultCell(prev, rowIndex, colIndex, cropped));
    },
    [activeUsecase],
  );

  const exportResults = useCallback(async () => {
    if (!hasAnyResult(results)) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      alert("キャンバスの初期化に失敗しました。");
      return;
    }

    try {
      const loadedImages = await loadAllImages(results);
      const { width, height } = calculateCellSize(loadedImages);
      canvas.width = width * activeUsecase.composition[0].length;
      canvas.height = height * activeUsecase.composition.length;

      loadedImages.forEach((row, rowIndex) => {
        row.forEach((img, colIndex) => {
          if (!img) return;
          ctx.drawImage(img, colIndex * width, rowIndex * height, width, height);
        });
      });
      const config = await FileSaveConfig.user();
      const downloadService = new DownloadService(config);
      const dataUrl = canvas.toDataURL("image/png");
      await downloadService.download(dataUrl);
    } catch (error) {
      log.error("exportResults failed", error);
      alert("画像の結合に失敗しました。コンソールログを確認してください。");
    }
  }, [results, activeUsecase]);

  const isExportDisabled = useMemo(() => !hasAnyResult(results), [results]);

  return {
    availableUsecases,
    activeUsecase,
    results,
    selectUsecase,
    captureCell,
    exportResults,
    isExportDisabled,
  };
}

function updateResultCell(
  current: ResultSet,
  targetRow: number,
  targetCol: number,
  value: string,
): ResultSet {
  return current.map((row, rowIndex) =>
    rowIndex !== targetRow
      ? row
      : row.map((cell, colIndex) => (colIndex === targetCol ? value : cell)),
  );
}

function hasAnyResult(candidate: ResultSet): boolean {
  return candidate.some((row) => row.some((cell) => cell !== null));
}

async function loadAllImages(results: ResultSet): Promise<(HTMLImageElement | null)[][]> {
  return Promise.all(
    results.map((row) =>
      Promise.all(row.map((src) => (src ? loadImage(src) : Promise.resolve(null)))),
    ),
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`画像を読み込めませんでした: ${src}`));
    img.src = src;
  });
}

function calculateCellSize(images: (HTMLImageElement | null)[][]) {
  let width = 0;
  let height = 0;
  images.forEach((row) => {
    row.forEach((img) => {
      if (!img) return;
      width = Math.max(width, img.width);
      height = Math.max(height, img.height);
    });
  });
  return { width, height };
}
