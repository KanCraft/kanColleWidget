import { useState } from "react";
import { EntryType, Fatigue, Mission, Recovery, Shipbuild } from "../../../models/entry";
import Queue from "../../../models/Queue";
import { KCWDate } from "../../../utils";
import { FatigueQueueView } from "./FatigueQueueView";
import { CustomQueueModal } from "./CustomQueueModal";

function QueueItemView({
  queue, index, label, edit,
  type,
}: {
  queue: Queue | null, index: number, label: string,
  type: EntryType,
  edit: (q: Queue | null) => void,
}) {
  if (!queue) {
    return <div className="flex text-gray-400 cursor-pointer"
      onClick={() => edit(Queue.new({ type, scheduled: Date.now(), params: { deck: index + 1, dock: index + 1 } }))}>
      <div className="mr-1">第{index + 1}{label}</div>
      <div>--:--</div>
    </div>
  }
  return (
    <div className="flex cursor-pointer"
      onClick={() => edit(queue)}>
      <div className="mr-1">第{index + 1}{label}</div>
      <div>{new KCWDate(queue.scheduled).format("HH:MM")}</div>
    </div>
  )

}

function QueueTableView({
  queues, edit,
}: {
  queues: Queue[],
  edit: (q: Queue | null) => void,
}) {
  const table: { [key in EntryType]: (Queue | null)[] } = {
    mission: queues.filter(q => q.type === "mission").reduce((acc, q) => { const entry = q.entry<Mission>(); acc[Number(entry.deck ?? 1) - 1] = q; return acc }, new Array(4).fill(null)),
    recovery: queues.filter(q => q.type === "recovery").reduce((acc, q) => { const entry = q.entry<Recovery>(); acc[Number(entry.dock ?? 1) - 1] = q; return acc }, new Array(4).fill(null)),
    shipbuild: queues.filter(q => q.type === "shipbuild").reduce((acc, q) => { const entry = q.entry<Shipbuild>(); acc[Number(entry.dock ?? 1) - 1] = q; return acc }, new Array(4).fill(null)),
    fatigue: queues.filter(q => q.type === "fatigue").reduce((acc, q) => { const entry = q.entry<Fatigue>(); acc[Number(entry.deck ?? 1) - 1] = q; return acc }, new Array(4).fill(null)),
    "unknown": [],
    "default": [],
  }
  return (
    <div className="flex space-x-4">
      <div id="mission-queue" className="flex-1">
        <h1 className={`font-bold border-b-2 border-sky-200`}>遠征</h1>
        {table.mission.map((q, i) => <QueueItemView key={i} index={i} queue={q} label="艦隊" type={EntryType.MISSION} edit={edit} />)}
      </div>
      <div id="recovery-queue" className="flex-1">
        <h1 className={`font-bold border-b-2 border-teal-200`}>修復</h1>
        {table.recovery.map((q, i) => <QueueItemView key={i} index={i} queue={q} label="ドック" type={EntryType.RECOVERY} edit={edit} />)}
      </div>
      <div id="shipbuild-queue" className="flex-1">
        <h1 className={`font-bold border-b-2 border-orange-200`}>建造</h1>
        {table.shipbuild.map((q, i) => <QueueItemView key={i} index={i} queue={q} label="ドック" type={EntryType.SHIPBUILD} edit={edit} />)}
      </div>
    </div>
  )
}

export function QueuesView({ queues }: { queues: Queue[] }) {
  const [modalQueue, setModalQueue] = useState<Queue | null>(null);
  return (
    <div>
      <QueueTableView queues={queues}
        edit={(q) => setModalQueue(q)}
      />
      <FatigueQueueView
        queues={queues.filter(q => q.type == EntryType.FATIGUE)} edit={setModalQueue}
      />
      <CustomQueueModal
        queue={modalQueue} close={() => setModalQueue(null)}
        update={(q) => setModalQueue(q)}
      />
    </div>
  )
}