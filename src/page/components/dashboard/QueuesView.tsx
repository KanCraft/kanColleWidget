import { EntryType, Fatigue, Mission, Recovery, Shipbuild } from "../../../models/entry";
import Queue from "../../../models/Queue";
import { KCWDate, M } from "../../../utils";

function QueueItemView({ queue, index, label }: { queue: Queue | null, index: number, label: string }) {
  if (!queue) {
    return <div className="flex text-gray-400">
      <div className="mr-1">第{index + 1}{label}</div>
      <div>--:--</div>
    </div>
  }
  return (
    <div className="flex">
      <div className="mr-1">第{index + 1}{label}</div>
      <div>{new KCWDate(queue.scheduled).format("HH:MM")}</div>
    </div>
  )

}

function QueueTableView({ queues }: { queues: Queue[] }) {
  const table: { [key in EntryType]: (Queue | null)[] } = {
    mission: queues.filter(q => q.type === "mission").reduce((acc, q) => { acc[q.entry<Mission>().deck - 1] = q; return acc }, new Array(4).fill(null)),
    recovery: queues.filter(q => q.type === "recovery").reduce((acc, q) => { acc[q.entry<Recovery>().dock - 1] = q; return acc }, new Array(4).fill(null)),
    shipbuild: queues.filter(q => q.type === "shipbuild").reduce((acc, q) => { acc[q.entry<Shipbuild>().dock - 1] = q; return acc }, new Array(4).fill(null)),
    fatigue: queues.filter(q => q.type === "fatigue").reduce((acc, q) => { acc[q.entry<Fatigue>().deck - 1] = q; return acc }, new Array(4).fill(null)),
    "unknown": [],
  }
  return (
    <div className="flex space-x-4">
      <div id="mission-queue" className="flex-1">
        <h1 className="font-bold border-b-2 border-sky-200">遠征</h1>
        {table.mission.map((q, i) => <QueueItemView key={i} index={i} queue={q} label="艦隊" />)}
      </div>
      <div id="recovery-queue" className="flex-1">
        <h1 className="font-bold border-b-2 border-teal-200">修復</h1>
        {table.recovery.map((q, i) => <QueueItemView key={i} index={i} queue={q} label="ドック" />)}
      </div>
      <div id="shipbuild-queue" className="flex-1">
        <h1 className="font-bold border-b-2 border-orange-200">建造</h1>
        {table.shipbuild.map((q, i) => <QueueItemView key={i} index={i} queue={q} label="ドック" />)}
      </div>
    </div>
  )
}

function FatigueQueueView({ queues }: { queues: Queue[] }) {
  // TODO: 本来は設定で時間を変更できるようにする
  const max = 15 * M;
  return (
    <div className="mt-2 space-y-1">
      {queues.sort((p,n) => p.scheduled > n.scheduled ? 1 : -1).map((q, i) => {
        const r = q.remain(max);
        const color = r.progress < 0.3 ? "bg-yellow-100" : r.progress < 0.6 ? "bg-orange-200" : "bg-red-200";
        const fatigue = q.entry<Fatigue>();
        return <div key={i} className="flex space-x-2 text-xs">
          <div className="mr-1">第{fatigue.deck}艦隊</div>
          <div>{fatigue.seamap.area}-{fatigue.seamap.info}</div>
          <div className="flex-1 bg-gray-100">
            <div className={`pl-1 text-gray-400 ${color}`} style={{width: `${Math.floor(r.progress * 100)}%`}}>
              {r.minutes}:{r.seconds}
            </div>
          </div>
        </div>
      })}
    </div>
  )
}

export function QueuesView({ queues }: { queues: Queue[] }) {
  return (
    <div>
      <QueueTableView queues={queues} />
      <FatigueQueueView queues={queues.filter(q => q.type == EntryType.FATIGUE)} />
    </div>
  )
}