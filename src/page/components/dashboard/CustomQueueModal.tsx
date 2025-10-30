import Queue from "../../../models/Queue";
import { EntryColor, EntryType } from "../../../models/entry";
import { KCWDate } from "../../../utils";

export function CustomQueueModal({
  queue, close, update,
}: {
  queue: Queue | null,
  close: () => void,
  update: (queue: Queue) => void,
}) {
  if (!queue) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-lg">
      <div className="bg-white p-4 flex flex-col space-y-4 rounded-md">
        <div className="flex space-x-2">
          <label>種別</label>
          <select defaultValue={queue.type} className={`bg-${EntryColor[queue.type]}-200 flex-1 rounded-md`}
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
        <div>
          <label>予定時刻</label>
          <input type="datetime-local" defaultValue={new KCWDate(queue.scheduled).format("YYYY-mm-ddTHH:MM")}
            onChange={e => { queue.scheduled = new Date(e.target.value).getTime(); update(queue) }}
          />
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
