import { useEffect, useState } from "react";
import Queue from "../../../models/Queue";
import { EntryType } from "../../../models/entry";
import { H, M } from "../../../utils";

function clampMinutes(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(59, Math.max(0, value));
}

function clampHours(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(9999, value));
}

export function CustomQueueModal({
  queue, close, update,
}: {
  queue: Queue | null,
  close: () => void,
  update: (queue: Queue) => void,
}) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    if (!queue) return;
    const remain = queue.remain();
    setHours(clampHours(remain.hours));
    setMinutes(clampMinutes(remain.minutes));
  }, [queue]);

  const updateSchedule = (nextHours: number, nextMinutes: number) => {
    if (!queue) return;
    queue.scheduled = Date.now() + nextHours * H + nextMinutes * M;
    update(queue);
  }

  if (!queue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-lg">
      <div className="bg-white p-4 flex flex-col space-y-4 rounded-md">
        <div className="flex space-x-2">
          <label>種別</label>
          <select defaultValue={queue.type} className={`kcw-custom-queue-select kcw-${queue.type} flex-1 rounded-md`}
            onChange={e => { queue.type = e.target.value as EntryType; update(queue) }}
          >
            <option value={EntryType.MISSION}>遠征</option>
            <option value={EntryType.RECOVERY}>修復</option>
            <option value={EntryType.SHIPBUILD}>建造</option>
            <option value={EntryType.FATIGUE}>疲労</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <label>{[EntryType.RECOVERY, EntryType.SHIPBUILD].includes(queue.type) ? "ドック" : "艦隊"}</label>
          <select defaultValue={queue.params["deck"] || queue.params["dock"]} className="flex-1 rounded-md"
            onChange={e => {
              queue.params[[EntryType.RECOVERY, EntryType.SHIPBUILD].includes(queue.type) ? "dock" : "deck"] = e.target.value;
              update(queue);
            }}
          >
            {[1, 2, 3, 4].map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div className="flex items-center">
          <div>
            <label>残り</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={0}
              max={9999}
              className="w-20 rounded-md border px-2 py-1 text-right"
              value={hours}
              onChange={e => {
                const value = clampHours(Number(e.target.value));
                setHours(value);
                updateSchedule(value, minutes);
              }}
            />
            <span>時間</span>
            <input
              type="number"
              min={0}
              max={59}
              className="w-16 rounded-md border px-2 py-1 text-right"
              value={minutes}
              onChange={e => {
                const value = clampMinutes(Number(e.target.value));
                setMinutes(value);
                updateSchedule(hours, value);
              }}
            />
            <span>分</span>
          </div>
        </div>
        <div className="flex space-x-2 justify-end">
          <button onClick={async () => { await queue.save(); close(); }}>保存</button>
          <button onClick={async () => { await queue.delete(); close(); }}>削除</button>
          <button onClick={close}>閉じる</button>
        </div>
      </div>
    </div>
  );
}
