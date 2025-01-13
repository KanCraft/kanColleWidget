import { type Fatigue } from "../../../models/entry";
import Queue from "../../../models/Queue";
import { M } from "../../../utils";

export function FatigueQueueView({ queues, edit }: { queues: Queue[], edit: (q: Queue | null) => void }) {
  // TODO: 本来は設定で時間を変更できるようにする
  const max = 15 * M;
  return (
    <div className="mt-2 space-y-1">
      {queues.sort((p,n) => p.scheduled > n.scheduled ? 1 : -1).map((q, i) => {
        const r = q.remain(max);
        const color = r.progress < 0.3 ? "bg-yellow-100" : r.progress < 0.6 ? "bg-orange-200" : "bg-red-200";
        const fatigue = q.entry<Fatigue>();
        return <div key={i} className="kcw-fatigue-queue-item flex space-x-2 text-xs cursor-pointer"
          onClick={async () => await q.delete()}>
          <div className="mr-1">第{fatigue.deck}艦隊</div>
          <div>{fatigue.seamap?.area}-{fatigue.seamap?.info}</div>
          <div className="flex-1 bg-gray-100">
            <div className={`pl-1 text-gray-400 ${color}`} style={{width: `${Math.floor(r.progress * 100)}%`}}>
              {r.minutes}:{r.seconds}
            </div>
          </div>
        </div>
      })}
      {queues.length === 0 && <div className="text-transparent hover:text-gray-400 hover:bg-gray-200 text-center cursor-pointer"
        onClick={() => edit(Queue.new({ type: "fatigue", scheduled: Date.now(), params: { deck: 1 } }))}
      >疲労回復予定はありません</div>}
    </div>
  )
}
