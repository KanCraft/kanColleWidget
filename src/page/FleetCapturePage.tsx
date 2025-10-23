import { useState } from "react";
import { CropService, Purpose } from "../services/CropService";
import { Launcher } from "../services/Launcher";
import { WorkerImage } from "../utils";

interface Usecase {
  id: string;
  title: string;
  description: string;
  crop: Purpose;
  page: number;
  count: number;
  composition: string[][];
}

type ResultSet = (string | null)[][];

const usecases: Usecase[] = [
  {
    id: "normal-fleet-capture",
    title: "通常艦隊の編成キャプチャ",
    description: "艦隊編成画面のスクリーンショットを手動で取得し、統合し、一枚の画像として保存する機能です。",
    crop: "fleet",
    page: 1,
    count: 6,
    composition: [
      ["旗艦","第二艦"],
      ["第三艦","第四艦"],
      ["第五艦","第六艦"],
    ]
  }
]

function createEmptyResultSet(composition: string[][]): ResultSet {
  return composition.map(row => row.map(() => null));
}

function ResultGridView({
  usecase, results,
  takeScreenshotOfCell,
}: {
  usecase: Usecase;
  results: ResultSet;
  takeScreenshotOfCell: (usecase: Usecase, row: number, col: number) => Promise<void>;
}) {
  const rows = usecase.composition.map((row, rowIndex) => {
    const cols = row.map((cell, colIndex) => {
      const src = results[rowIndex][colIndex];
      return (
        <td key={colIndex} className="border">
          {src ? (
            <img src={src} alt={`Result ${cell}`} />
          ) : (
            <div className="w-32 h-24 bg-gray-200 flex items-center justify-center cursor-pointer"
              onClick={async () => {
                await takeScreenshotOfCell(usecase, rowIndex, colIndex);
              }}
            >
              <span className="text-gray-500">{usecase.composition[rowIndex][colIndex]}</span>
            </div>
          )}
        </td>
      );
    });
    return (
      <tr key={rowIndex}>
        {cols}
      </tr>
    );
  });
  return (
    <table className="table-auto border-collapse border w-1/3">
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

export function FleetCapturePage() {
  const [usecase, setUsecase] = useState(usecases[0]);
  const [results, setResults] = useState<ResultSet>(createEmptyResultSet(usecase.composition));

  const takeScreenshotOfCell = async (usecase: Usecase, row: number, col: number) => {
    const launcher = new Launcher();
    const win = await launcher.find();
    if (!win) return alert("ゲームが見つかりません");
    const whole = await launcher.capture(win.id!);
    const img = await WorkerImage.from(whole);
    const cropper = new CropService(img);
    const cropped = await cropper.crop(usecase.crop);
    results[row][col] = cropped;
    setResults([...results]);
  }
  const hasAtLeastOneResult = results.some(row => row.some(cell => cell !== null));
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold">艦隊キャプチャ</h1>
      <div className="">
        「編成キャプチャ」とは、艦隊編成画面のスクリーンショットを手動で取得し、統合し、一枚の画像として保存する機能です。<br />
      </div>
      <div>
        <select value={usecase.id} onChange={(e) => {
          const selected = usecases.find(u => u.id === e.target.value);
          if (selected) {
            setUsecase(selected);
            setResults(createEmptyResultSet(selected.composition));
          }
        }} className="border p-2 rounded">
          {usecases.map((u) => (
            <option key={u.id} value={u.id}>{u.title}</option>
          ))}
        </select>
      </div>
      <div>
        <ResultGridView usecase={usecase} results={results} takeScreenshotOfCell={takeScreenshotOfCell} />
      </div>
      <div>
        <button
          className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded ${!hasAtLeastOneResult ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={!hasAtLeastOneResult}
          onClick={async () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d")!;
            const cellWidth = results[0].reduce((max, src) => {
              if (!src) return max;
              const img = new Image();
              img.src = src;
              return Math.max(max, img.width);
            }, 0);
            const cellHeight = results.reduce((max, row) => {
              return row.reduce((max2, src) => {
                if (!src) return max2;
                const img = new Image();
                img.src = src;
                return Math.max(max2, img.height);
              }, max);
            }, 0);
            canvas.width = cellWidth * usecase.composition[0].length;
            canvas.height = cellHeight * usecase.composition.length;
            for (let r = 0; r < results.length; r++) {
              for (let c = 0; c < results[r].length; c++) {
                const src = results[r][c];
                if (!src) continue;
                const img = new Image();
                img.src = src;
                await new Promise<void>((resolve) => {
                  img.onload = () => {
                    ctx.drawImage(img, c * cellWidth, r * cellHeight, cellWidth, cellHeight);
                    resolve();
                  };
                });
              }
            }
            // TODO: ダウンロードサービスを使い、フォルダやファイル名の指定を可能にする
            canvas.toBlob((blob) => {
              if (!blob) return;
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `fleet_capture_${Date.now()}.png`;
              a.click();
              URL.revokeObjectURL(url);
            }, "image/png");
          }}
        >上記を1枚の画像にしてエクスポート</button>
      </div>
    </div>
  );
}
