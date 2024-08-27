import { useEffect, useState } from "react";
import { EntryType, Fatigue, Mission, Recovery, Shipbuild } from "../../../models/entry";
import Queue from "../../../models/Queue";
import { KCWDate } from "../../../utils";

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
      <div>{new KCWDate(queue.scheduled).format("HH:mm")}</div>
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
      <div id="mission-queue">
        <h1 className="font-bold border-b-2 border-sky-200">遠征</h1>
        {table.mission.map((q, i) => <QueueItemView key={i} index={i} queue={q} label="艦隊" />)}
      </div>
      <div id="recovery-queue">
        <h1 className="font-bold border-b-2 border-teal-200">修復</h1>
        {table.recovery.map((q, i) => <QueueItemView key={i} index={i} queue={q} label="ドック" />)}
      </div>
      <div id="shipbuild-queue">
        <h1 className="font-bold border-b-2 border-orange-200">建造</h1>
        {table.shipbuild.map((q, i) => <QueueItemView key={i} index={i} queue={q} label="ドック" />)}
      </div>
      <div id="fatigue-queue">
        <h1 className="font-bold border-b-2 border-red-200">疲労</h1>
        {table.fatigue.map((q, i) => <QueueItemView key={i} index={i} queue={q} label="艦隊" />)}
      </div>
    </div>
  )
}

export function QueuesView() {
  const [queues, setQueues] = useState<Queue[]>([]);
  useEffect(() => {
    Queue.list().then(setQueues);
    const interval = setInterval(async () => Queue.list().then(setQueues), 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <QueueTableView queues={queues} />
    </div>
  )
}