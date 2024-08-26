
export class KCWDate extends Date {
  public format(format: string): string {
    const matches = format.matchAll(/(?<year>y{2,4})?\/?(?<month>M{2})?\/?(?<day>d{2})?[ ]*?(?<hour>H{1,2}):(?<minute>m{1,2}):?(?<second>s{1,2})?/g);
    const { year, month, day, hour, minute, second } = matches.next().value.groups;
    let r = format;
    if (year) r = r.replace(year, this.getFullYear().toString().slice(-year.length));
    if (month) r = r.replace(month, (this.getMonth() + 1).toString().padStart(2, "0"));
    if (day) r = r.replace(day, this.getDate().toString().padStart(2, "0"));
    if (hour) r = r.replace(hour, this.getHours().toString().padStart(2, "0"));
    if (minute) r = r.replace(minute, this.getMinutes().toString().padStart(2, "0"));
    if (second) r = r.replace(second, this.getSeconds().toString().padStart(2, "0"));
    return r;
  }

  public static ETA(time: number, now: number = Date.now()): KCWDate {
    return new KCWDate(now + time);
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const S = 1000;
const M = 60 * S;
const H = 60 * M;
const D = 24 * H;
export {
  S, M, H, D
}