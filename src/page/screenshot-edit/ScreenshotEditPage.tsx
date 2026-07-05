import { useSearchParams } from "react-router-dom";
import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  ScissorsIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { useScreenshotEditor, type ToolType } from "./useScreenshotEditor";

function ToolButton({
  active,
  disabled,
  onClick,
  icon: Icon,
  label,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: typeof ScissorsIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-2 rounded border ${
        active ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <Icon className="w-5 h-5" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export function ScreenshotEditPage() {
  const [searchParams] = useSearchParams();
  const editor = useScreenshotEditor(searchParams.get("key"));

  const toggleTool = (tool: ToolType) => {
    editor.selectTool(editor.tool === tool ? null : tool);
  };

  if (editor.status === "missing") {
    return (
      <div className="p-8 space-y-4">
        <h1 className="text-3xl font-bold">スクリーンショット編集</h1>
        <p>
          編集対象の画像が見つかりませんでした。
          撮影から時間が経つと画像は破棄されるため、もう一度撮影してください。
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">スクリーンショット編集</h1>
      <p className="text-sm text-gray-600">
        切り取りや矩形の描き込みをしてから保存できます。保存せずにこのタブを閉じると画像は破棄されます。
      </p>
      <div className="flex items-center gap-2">
        <ToolButton
          active={editor.tool === "crop"}
          onClick={() => toggleTool("crop")}
          icon={ScissorsIcon}
          label="切り取り"
        />
        <ToolButton
          active={editor.tool === "rect"}
          onClick={() => toggleTool("rect")}
          icon={StopIcon}
          label="矩形"
        />
        <input
          type="color"
          value={editor.color}
          onChange={(e) => editor.setColor(e.target.value)}
          className="h-10 w-10 cursor-pointer"
          title="矩形の色"
        />
        <ToolButton
          disabled={!editor.canUndo}
          onClick={editor.undo}
          icon={ArrowUturnLeftIcon}
          label="ひとつ戻す"
        />
        <div className="flex-1" />
        <ToolButton
          disabled={editor.status !== "ready"}
          onClick={() => void editor.save()}
          icon={ArrowDownTrayIcon}
          label="保存"
        />
      </div>
      <canvas
        ref={editor.canvasRef}
        onMouseDown={editor.onMouseDown}
        onMouseMove={editor.onMouseMove}
        onMouseUp={editor.onMouseUp}
        onMouseLeave={editor.onMouseLeave}
        className={`max-w-full border shadow ${editor.tool ? "cursor-crosshair" : ""}`}
      />
    </div>
  );
}
