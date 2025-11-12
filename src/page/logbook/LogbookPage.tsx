import { useLoaderData } from "react-router-dom";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { SortieContext } from "../../models/Logbook";

export function LogbookPage() {
  const { sorties } = useLoaderData() as { sorties: SortieContext[] };
  console.log(sorties);
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center space-x-2">
        <BookOpenIcon className="w-6 h-6 text-slate-600" />
        <h1 className="text-2xl font-bold text-slate-800">出撃記録</h1>
      </div>
      <div>
        <blockquote className="border-l-4 border-teal-400 pl-4 italic text-slate-600 mb-4">
          よくわかんねえけど作り始めたページ。よくわかんねえ。WebRequestで「マス」情報が取れるといいんだけどねえ。たぶん今取得できてる「マス」は間違ってる。でも何の意味なのかもわからん
        </blockquote>
      </div>

      {sorties.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          出撃記録がありません
        </div>
      ) : (
        <div className="space-y-4">
          {sorties.map((sortie) => (
            <div
              key={sortie._id}
              className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-sm text-slate-500">
                    {new Date(sortie.started).toLocaleString("ja-JP")}
                  </div>
                  {sortie.map && (
                    <div className="font-semibold text-slate-800">
                      {sortie.map.area}-{sortie.map.info}
                    </div>
                  )}
                  {sortie.deck && (
                    <div className="text-sm text-slate-600">
                      艦隊: {sortie.deck}
                    </div>
                  )}
                </div>
                <div className="text-sm text-slate-500">
                  {sortie.battles.length} 戦闘
                </div>
              </div>

              {sortie.battles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {sortie.battles.map((battle, idx) => (
                    <div
                      key={idx}
                      className="text-sm border-l-2 border-teal-400 pl-3 py-1"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-600">
                          マス: {battle.cell || "不明"}
                        </span>
                        <span className="text-slate-500">
                          陣形: {battle.formation}
                        </span>
                        {battle.midnight && (
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                            夜戦
                          </span>
                        )}
                      </div>
                      {battle.result && (
                        <div className="text-xs text-slate-500 mt-1">
                          結果: {battle.result}
                        </div>
                      )}
                      {battle.reward && (
                        <div className="text-xs text-slate-500">
                          報酬: {battle.reward}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
