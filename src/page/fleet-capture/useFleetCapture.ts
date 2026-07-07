import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRevalidator } from "react-router-dom";
import { CropService, type RelativeRect } from "../../services/CropService";
import { DownloadService } from "../../services/DownloadService";
import { Launcher } from "../../services/Launcher";
import { WorkerImage } from "../../utils";
import { Logger } from "../../logger";
import { CapturePreset } from "../../models/CapturePreset";
import { FileSaveConfig } from "../../models/configs/FileSaveConfig";
import { FleetCaptureConfig, TransparentBackground } from "../../models/configs/FleetCaptureConfig";
import {
  createEmptyResultSet,
  type FleetCaptureController,
  type ResultSet,
} from "./types";
import { MaxGridSize, MinGridSize, resizeComposition, resizeResultSet } from "./composition";

interface UseFleetCaptureOptions {
  presets: CapturePreset[];
}

export function useFleetCapture({ presets }: UseFleetCaptureOptions): FleetCaptureController {
  const log = Logger.get("FleetCapture");
  const revalidator = useRevalidator();

  const [activePresetId, setActivePresetId] = useState<string>(presets[0]._id!);
  const activePreset = presets.find((preset) => preset._id === activePresetId) ?? presets[0];

  const [rect, setRectState] = useState<RelativeRect>(activePreset.rect);
  const [composition, setComposition] = useState<string[][]>(activePreset.composition);
  const [results, setResults] = useState<ResultSet>(
    createEmptyResultSet(activePreset.composition),
  );
  const [preview, setPreview] = useState<string | null>(null);

  const applyPreset = useCallback((preset: CapturePreset) => {
    setActivePresetId(preset._id!);
    setRectState(preset.rect);
    setComposition(preset.composition);
    setResults(createEmptyResultSet(preset.composition));
  }, []);

  const selectPreset = useCallback(
    (presetId: string) => {
      const selected = presets.find((candidate) => candidate._id === presetId);
      if (!selected) return;
      applyPreset(selected);
    },
    [presets, applyPreset],
  );

  const setRect = useCallback((next: RelativeRect) => {
    setRectState({
      x: clamp(next.x, 0, 1),
      y: clamp(next.y, 0, 1),
      w: clamp(next.w, 0.01, 1),
      h: clamp(next.h, 0.01, 1),
    });
  }, []);

  const setGridSize = useCallback((rows: number, cols: number) => {
    rows = clamp(rows, MinGridSize, MaxGridSize);
    cols = clamp(cols, MinGridSize, MaxGridSize);
    setComposition((prev) => resizeComposition(prev, rows, cols));
    setResults((prev) => resizeResultSet(prev, rows, cols));
  }, []);

  const modified = useMemo(
    () =>
      JSON.stringify(rect) !== JSON.stringify(activePreset.rect) ||
      JSON.stringify(composition) !== JSON.stringify(activePreset.composition),
    [rect, composition, activePreset],
  );

  const refreshPreview = useCallback(async () => {
    const launcher = new Launcher();
    const win = await launcher.find();
    if (!win) {
      setPreview(null);
      return;
    }
    try {
      setPreview(await launcher.capture(win.id!));
    } catch (error) {
      log.error("refreshPreview failed", error);
      setPreview(null);
    }
  }, [log]);

  // 初回表示時にプレビューを取得する（StrictModeの二重実行で連続キャプチャしないようガード）
  const previewRequested = useRef(false);
  useEffect(() => {
    if (previewRequested.current) return;
    previewRequested.current = true;
    void refreshPreview();
  }, [refreshPreview]);

  const captureCell = useCallback(
    async (rowIndex: number, colIndex: number) => {
      const launcher = new Launcher();
      const win = await launcher.find();
      if (!win) {
        alert("ゲームウィンドウを検出できませんでした。");
        return;
      }
      try {
        const whole = await launcher.capture(win.id!);
        const workerImage = await WorkerImage.from(whole);
        const cropper = new CropService(workerImage);
        const cropped = await cropper.cropRelative(rect);
        setResults((prev) => updateResultCell(prev, rowIndex, colIndex, cropped));
      } catch (error) {
        log.error("captureCell failed", error);
        alert("ゲームウィンドウのキャプチャに失敗しました。");
      }
    },
    [rect, log],
  );

  const clearCell = useCallback((rowIndex: number, colIndex: number) => {
    setResults((prev) => updateResultCell(prev, rowIndex, colIndex, null));
  }, []);

  const updatePreset = useCallback(async () => {
    if (activePreset.protected) return;
    await activePreset.update({ rect, composition });
    revalidator.revalidate();
  }, [activePreset, rect, composition, revalidator]);

  const saveAsNewPreset = useCallback(async () => {
    const name = window.prompt("新しいプリセットの名前を入力してください。");
    if (!name) return;
    const created = await CapturePreset.create({
      name,
      description: "",
      rect,
      composition,
      protected: false,
    });
    setActivePresetId(created._id!);
    revalidator.revalidate();
  }, [rect, composition, revalidator]);

  const deletePreset = useCallback(async () => {
    if (activePreset.protected) return;
    if (!window.confirm(`プリセット「${activePreset.name}」を削除します。よろしいですか？`)) return;
    await activePreset.delete();
    // 組み込みプリセットは削除できないため、残りの先頭が必ず存在する
    const remaining = presets.filter((preset) => preset._id !== activePreset._id);
    applyPreset(remaining[0]);
    revalidator.revalidate();
  }, [activePreset, presets, applyPreset, revalidator]);

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
      canvas.width = width * composition[0].length;
      canvas.height = height * composition.length;

      // 空白セルが残る場合に備え、設定された背景色で下地を塗る
      const fleetcapture = await FleetCaptureConfig.user();
      if (fleetcapture.background !== TransparentBackground) {
        ctx.fillStyle = fleetcapture.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      loadedImages.forEach((row, rowIndex) => {
        row.forEach((img, colIndex) => {
          if (!img) return;
          ctx.drawImage(img, colIndex * width, rowIndex * height, width, height);
        });
      });
      const config = await FileSaveConfig.user();
      const downloadService = new DownloadService(config);
      const dataUrl = canvas.toDataURL(`image/${config.format}`);
      await downloadService.download(dataUrl);
    } catch (error) {
      log.error("exportResults failed", error);
      alert("画像の結合に失敗しました。コンソールログを確認してください。");
    }
  }, [results, composition, log]);

  const isExportDisabled = useMemo(() => !hasAnyResult(results), [results]);

  return {
    presets,
    activePreset,
    rect,
    composition,
    modified,
    preview,
    results,
    selectPreset,
    setRect,
    setGridSize,
    refreshPreview,
    captureCell,
    clearCell,
    updatePreset,
    saveAsNewPreset,
    deletePreset,
    exportResults,
    isExportDisabled,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function updateResultCell(
  current: ResultSet,
  targetRow: number,
  targetCol: number,
  value: string | null,
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
