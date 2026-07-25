import { useState } from "react";
import { useRevalidator } from "react-router-dom";
import { CapturePreset } from "../../../models/CapturePreset";
import { moveItem } from "../../../models/capturePresetOrder";

/**
 * 編成キャプチャのプリセット一覧。
 * 行をドラッグして並べ替えると、その順序が編成キャプチャ画面の選択肢にも反映される。
 * ドラッグ中は落とした結果の並びをそのまま表示し、掴んでいる行を空けて見せる。
 */
export function CapturePresetListView({ presets }: { presets: CapturePreset[] }) {
  const revalidator = useRevalidator();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  // ドラッグ中の仮の並び。掴んでいない間は null
  const [preview, setPreview] = useState<CapturePreset[] | null>(null);

  const shown = preview ?? presets;

  const endDrag = () => {
    setDraggingId(null);
    setPreview(null);
  };

  // 掴んでいる行をカーソル下の位置へ動かした並びを組み立てる
  const previewMoveTo = (index: number) => {
    if (!draggingId) return;
    setPreview((current) => {
      const list = current ?? presets;
      const from = list.findIndex((preset) => preset._id === draggingId);
      if (from < 0 || from === index) return list;
      return moveItem(list, from, index);
    });
  };

  const commit = async () => {
    const reordered = preview;
    endDrag();
    if (!reordered) return;
    if (reordered.every((preset, index) => preset._id === presets[index]._id)) return;
    // 並び順を保存していないプリセットにも order を書き込むため、差分ではなく全件を保存する。
    // jstorm の保存はレコード全体を読み書きするため、並行させると更新が取りこぼされる
    for (const [order, preset] of reordered.entries()) {
      await preset.update({ order });
    }
    revalidator.revalidate();
  };

  const remove = async (preset: CapturePreset) => {
    if (!window.confirm(`プリセット「${preset.name}」を削除します。よろしいですか？`)) return;
    await preset.delete();
    revalidator.revalidate();
  };

  return (
    <ul>
      {shown.map((preset, index) => {
        const dragging = preset._id === draggingId;
        return (
          <li
            key={preset._id}
            draggable
            onDragStart={() => {
              setDraggingId(preset._id!);
              setPreview(presets);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              previewMoveTo(index);
            }}
            onDrop={(event) => {
              event.preventDefault();
              void commit();
            }}
            onDragEnd={endDrag}
            className={`border rounded p-2 mb-2 cursor-move ${
              dragging ? "border-dashed border-blue-400 bg-slate-50" : "border-slate-200"
            }`}
          >
            <div className={`flex items-center ${dragging ? "invisible" : ""}`}>
              <span aria-hidden="true" className="mr-2 text-gray-400 select-none">⠿</span>
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
                  onClick={() => void remove(preset)}
                >削除</button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
