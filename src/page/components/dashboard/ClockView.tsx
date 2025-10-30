
enum DayOfWeek {
    日 = 0,
    月 = 1,
    火 = 2,
    水 = 3,
    木 = 4,
    金 = 5,
    土 = 6,
}

export function ClockView({ time }: { time: Date }) {
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();
  return (
    <div className="">
      <div className="">
        <div>{year}/{month.toString().padStart(2, "0")}/{date.toString().padStart(2, "0")} ({DayOfWeek[day]})</div>
      </div>
      <div className="flex text-4xl">
        <div>{hour.toString().padStart(2, "0")}</div>
        <div>:</div>
        <div>{minute.toString().padStart(2, "0")}</div>
        <div className="ml-1 text-xs animate-pulse">{second.toString().padStart(2, "0")}</div>
      </div>
    </div>
  )
}