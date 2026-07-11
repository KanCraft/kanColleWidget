import { useEffect, useState } from "react";
import Queue from "../../../models/Queue";
import { EntryType } from "../../../models/entry";
import { ManualTimerInputStyle } from "../../../models/configs/DashboardConfig";
import { H, M } from "../../../utils";

function clampMinutes(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(59, Math.max(0, value));
}

function clampHours(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(9999, value));
}

// 残り時間を time input (HH:MM) の値文字列にする。time input の上限 23:59 に丸める。
function toTimeInputValue(remain: { hours: number, minutes: number }): string {
  if (remain.hours >= 24) return "23:59";
  return `${String(remain.hours).padStart(2, "0")}:${String(remain.minutes).padStart(2, "0")}`;
}

export function CustomQueueModal({
  queue, close, update, manualTimerInput = "split",
}: {
  queue: Queue | null,
  close: () => void,
  update: (queue: Queue) => void,
  manualTimerInput?: ManualTimerInputStyle,
}) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [draft, setDraft] = useState("00:00");

  useEffect(() => {
    if (!queue) return;
    const remain = queue.remain();
    setHours(clampHours(remain.hours));
    setMinutes(clampMinutes(remain.minutes));
    setDraft(toTimeInputValue(remain));
  }, [queue]);

  const updateSchedule = (nextHours: number, nextMinutes: number) => {
    if (!queue) return;
    queue.scheduled = Date.now() + nextHours * H + nextMinutes * M;
    update(queue);
  }

  const save = async () => {
    if (!queue) return;
    await queue.save();
    close();
  }

  const saveOnEnter = (ev: React.KeyboardEvent) => {
    if (ev.key === "Enter") save();
  }

  if (!queue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center text-lg">
      <div className="bg-white p-4 flex flex-col space-y-4 rounded-md">
        <div className="flex space-x-2">
          <label>種別</label>
          <select defaultValue={queue.type} className={`kcw-custom-queue-select kcw-${queue.type} flex-1 rounded-md`}
            onChange={e => {
              queue.type = e.target.value as EntryType;
              // API傍受で作られたQueueは deck / dock の一方しか持たないため、種別切替時にもう一方へ引き継ぐ
              queue.params["deck"] ??= queue.params["dock"];
              queue.params["dock"] ??= queue.params["deck"];
              update(queue);
            }}
          >
            <option value={EntryType.MISSION}>遠征</option>
            <option value={EntryType.RECOVERY}>修復</option>
            <option value={EntryType.SHIPBUILD}>建造</option>
            <option value={EntryType.FATIGUE}>疲労</option>
          </select>
        </div>
        <div className="flex space-x-2">
          <label>{[EntryType.RECOVERY, EntryType.SHIPBUILD].includes(queue.type) ? "ドック" : "艦隊"}</label>
          <select defaultValue={queue.params["deck"] || queue.params["dock"]} className="flex-1 rounded-md bg-slate-100"
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
          {manualTimerInput === "time" ? (
            <div className="flex items-center space-x-2">
              <input
                type="time"
                className="rounded-md border px-2 py-1"
                value={draft}
                autoFocus
                onKeyDown={saveOnEnter}
                onChange={e => {
                  const value = e.target.value;
                  setDraft(value);
                  const matched = value.match(/^(\d{2}):(\d{2})$/);
                  if (!matched) return;
                  updateSchedule(Number(matched[1]), Number(matched[2]));
                }}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={0}
                max={9999}
                className="w-20 rounded-md border px-2 py-1 text-right"
                value={hours}
                autoFocus
                onFocus={e => e.currentTarget.select()}
                onKeyDown={saveOnEnter}
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
                onFocus={e => e.currentTarget.select()}
                onKeyDown={saveOnEnter}
                onChange={e => {
                  const value = clampMinutes(Number(e.target.value));
                  setMinutes(value);
                  updateSchedule(hours, value);
                }}
              />
              <span>分</span>
            </div>
          )}
        </div>
        <div className="flex space-x-2 justify-end">
          <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm" onClick={save}>保存</button>
          <button className="px-3 py-1 bg-red-400 text-white rounded-md text-sm" onClick={async () => { await queue.delete(); close(); }}>削除</button>
          <button className="px-3 py-1 border border-slate-200 bg-slate-100 rounded-md text-sm" onClick={close}>閉じる</button>
        </div>
      </div>
    </div>
  );
}
