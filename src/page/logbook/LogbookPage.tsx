import { useEffect, useState } from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { ArrowPathIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { SortieContext } from "../../models/Logbook";
import { describeBattles, formatStarted } from "./format";

// 自動更新オン時の再読込間隔（ミリ秒）
const RELOAD_INTERVAL_MS = 5 * 1000;

export function LogbookPage() {
  const { sorties } = useLoaderData() as { sorties: SortieContext[] };
  const revalidator = useRevalidator();
  const [autoReload, setAutoReload] = useState(false);

  // 自動更新がオンの間だけ、保存された新しい出撃記録を定期的に再読込する
  useEffect(() => {
    if (!autoReload) return;
    const interval = setInterval(() => revalidator.revalidate(), RELOAD_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [autoReload, revalidator]);

  // 新しい出撃が上に来るよう降順で表示する
  const sorted = [...sorties].sort((a, b) => b.started - a.started);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center space-x-2">
        <BookOpenIcon className="w-6 h-6 text-slate-600" />
        <h1 className="text-2xl font-bold text-slate-800">出撃記録</h1>
        <button
          onClick={() => revalidator.revalidate()}
          className="ml-4 flex items-center space-x-1 border rounded px-2 py-1 text-sm text-slate-600 hover:bg-slate-50"
        >
          <ArrowPathIcon className="w-4 h-4" />
          <span>更新</span>
        </button>
        <label className="flex items-center space-x-1 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={autoReload}
            onChange={(e) => setAutoReload(e.target.checked)}
            className="w-4 h-4"
          />
          <span>自動更新</span>
        </label>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          出撃記録がありません
        </div>
      ) : (
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-300">
              <th className="py-2 pr-4 font-medium">出撃日時</th>
              <th className="py-2 pr-4 font-medium">海域</th>
              <th className="py-2 pr-4 font-medium">艦隊</th>
              <th className="py-2 pr-4 font-medium">戦闘数</th>
              <th className="py-2 font-medium">戦闘（陣形、(夜)=夜戦あり）</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((sortie) => (
              <tr
                key={sortie._id ?? sortie.started}
                className="border-b border-slate-100 odd:bg-slate-100 hover:bg-slate-200"
              >
                <td className="py-1.5 pr-4 text-slate-500 whitespace-nowrap">
                  {formatStarted(sortie.started)}
                </td>
                <td className="py-1.5 pr-4 font-semibold text-slate-800 whitespace-nowrap">
                  {sortie.map ? `${sortie.map.area}-${sortie.map.info}` : "-"}
                </td>
                <td className="py-1.5 pr-4 text-slate-600">
                  {sortie.deck ?? "-"}
                </td>
                <td className="py-1.5 pr-4 text-slate-600 whitespace-nowrap">
                  {sortie.battles.length}戦
                </td>
                <td className="py-1.5 text-slate-600">
                  {describeBattles(sortie) || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
