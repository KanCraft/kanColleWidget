import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { TempStorage } from "../../services/TempStorage";
import { DownloadService } from "../../services/DownloadService";
import { FileSaveConfig } from "../../models/configs/FileSaveConfig";

// 編集ツール種別。crop: ドラッグ範囲で切り取り、rect: ドラッグ範囲に矩形を描く
export type ToolType = "crop" | "rect";

// 画像の読み込み状態。missing はキー不正・有効期限切れなどで画像を取得できなかった状態
export type EditorStatus = "loading" | "ready" | "missing";

interface Position {
  x: number;
  y: number;
}

export interface ScreenshotEditorController {
  canvasRef: RefObject<HTMLCanvasElement>;
  status: EditorStatus;
  tool: ToolType | null;
  color: string;
  canUndo: boolean;
  // null 指定でツール選択を解除する
  selectTool: (tool: ToolType | null) => void;
  setColor: (color: string) => void;
  undo: () => void;
  save: () => Promise<void>;
  onMouseDown: (ev: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (ev: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: (ev: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseLeave: (ev: React.MouseEvent<HTMLCanvasElement>) => void;
}

/**
 * スクショ編集ページの canvas 編集ロジック。
 * TempStorage から画像を読み込んで canvas に展開し、
 * 切り取り・矩形描画・undo・保存（ダウンロード）を提供する。
 * @param key TempStorage の取り出しキー（URL パラメータから渡される）
 */
export function useScreenshotEditor(key: string | null): ScreenshotEditorController {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<EditorStatus>("loading");
  const [tool, setTool] = useState<ToolType | null>(null);
  const [color, setColor] = useState("#01d0d0");
  // undo ボタンの活性制御用。実体は historyRef で、これはその長さを反映するだけ
  const [historySize, setHistorySize] = useState(0);
  // 過去の状態のスタック。現在の状態は含まない
  const historyRef = useRef<ImageData[]>([]);
  // ドラッグ中の始点と、ドラッグ開始時点の canvas スナップショット
  const dragRef = useRef<{ start: Position, snapshot: ImageData } | null>(null);
  // TempStorage.draw は取得と同時に削除するため、二重実行（React.StrictMode の
  // 二重マウント等）で2回目が missing になるのをガードする
  const loadStartedRef = useRef(false);

  useEffect(() => {
    if (loadStartedRef.current) return;
    loadStartedRef.current = true;
    (async () => {
      if (!key) {
        setStatus("missing");
        return;
      }
      const uri = await new TempStorage().draw(key);
      if (!uri) {
        setStatus("missing");
        return;
      }
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("撮影画像を読み込めませんでした"));
        img.src = uri;
      });
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      setStatus("ready");
    })().catch(() => setStatus("missing"));
  }, [key]);

  const popHistory = useCallback((): ImageData | undefined => {
    const memory = historyRef.current.pop();
    setHistorySize(historyRef.current.length);
    return memory;
  }, []);

  const pushHistory = useCallback((snapshot: ImageData) => {
    historyRef.current.push(snapshot);
    setHistorySize(historyRef.current.length);
  }, []);

  const onMouseDown = useCallback((ev: React.MouseEvent<HTMLCanvasElement>) => {
    if (!tool || status !== "ready") return;
    const canvas = ev.currentTarget;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    pushHistory(snapshot);
    dragRef.current = { start: positionOf(ev), snapshot };
  }, [tool, status, pushHistory]);

  const onMouseMove = useCallback((ev: React.MouseEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag || !tool) return;
    const ctx = ev.currentTarget.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(drag.snapshot, 0, 0);
    drawPreview(ctx, tool, color, drag.start, positionOf(ev));
  }, [tool, color]);

  const onMouseUp = useCallback((ev: React.MouseEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag || !tool) return;
    dragRef.current = null;
    const canvas = ev.currentTarget;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(drag.snapshot, 0, 0);
    const applied = applyTool(canvas, ctx, tool, color, drag.start, positionOf(ev));
    // 大きさゼロで確定した場合など、何も変わらなかったら履歴も積まなかったことにする
    if (!applied) popHistory();
  }, [tool, color, popHistory]);

  // ドラッグ中にカーソルが canvas 外へ出たら、その操作はキャンセルする
  const onMouseLeave = useCallback((ev: React.MouseEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    ev.currentTarget.getContext("2d")?.putImageData(drag.snapshot, 0, 0);
    popHistory();
  }, [popHistory]);

  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const memory = popHistory();
    if (!memory) return;
    // 切り取りで canvas サイズが変わっていることがあるため、サイズごと戻す
    canvas.width = memory.width;
    canvas.height = memory.height;
    ctx.putImageData(memory, 0, 0);
  }, [popHistory]);

  const save = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const config = await FileSaveConfig.user();
    const uri = canvas.toDataURL(`image/${config.format}`);
    await new DownloadService(config).download(uri);
  }, []);

  return {
    canvasRef,
    status,
    tool,
    color,
    canUndo: historySize > 0,
    selectTool: setTool,
    setColor,
    undo,
    save,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
  };
}

/**
 * マウスイベントの位置を canvas 内部座標系に変換する。
 * canvas は CSS で縮小表示されることがあるため、表示サイズとの比率で補正する。
 */
function positionOf(ev: React.MouseEvent<HTMLCanvasElement>): Position {
  const canvas = ev.currentTarget;
  const scale = canvas.width / canvas.offsetWidth;
  return {
    x: ev.nativeEvent.offsetX * scale,
    y: ev.nativeEvent.offsetY * scale,
  };
}

/**
 * ドラッグ中のプレビューを描画する。crop は白の破線、rect は選択色の実線
 */
function drawPreview(
  ctx: CanvasRenderingContext2D,
  tool: ToolType,
  color: string,
  start: Position,
  end: Position,
) {
  ctx.save();
  if (tool === "crop") {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
  }
  ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
  ctx.restore();
}

/**
 * ドラッグ確定時にツールの効果を canvas に適用する
 * @returns 変更を適用したら true、大きさゼロなどで何もしなかったら false
 */
function applyTool(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  tool: ToolType,
  color: string,
  start: Position,
  end: Position,
): boolean {
  const sx = Math.max(0, Math.min(start.x, end.x));
  const sy = Math.max(0, Math.min(start.y, end.y));
  const sw = Math.min(canvas.width - sx, Math.abs(end.x - start.x));
  const sh = Math.min(canvas.height - sy, Math.abs(end.y - start.y));
  if (sw < 1 || sh < 1) return false;

  if (tool === "rect") {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    ctx.restore();
    return true;
  }

  // crop: 選択範囲を取り出して canvas を選択範囲サイズに作り直す
  const data = ctx.getImageData(sx, sy, sw, sh);
  canvas.width = sw;
  canvas.height = sh;
  ctx.putImageData(data, 0, 0);
  return true;
}
