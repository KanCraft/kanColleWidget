
export class KCWDate extends Date {
  public format(format: string): string {
    const matches = format.matchAll(/(?<year>y{2,4})?\/?(?<month>m{2})?\/?(?<day>d{2})?[ ]*?(?<hour>H{1,2}):(?<minute>M{1,2}):?(?<second>S{1,2})?/g);
    if (!matches) return format;
    const g = matches.next()?.value?.groups || {};
    let r = format;
    if (g.year)   r = r.replace(g.year, this.getFullYear().toString().slice(-g.year.length));
    if (g.month)  r = r.replace(g.month, (this.getMonth() + 1).toString().padStart(2, "0"));
    if (g.day)    r = r.replace(g.day, this.getDate().toString().padStart(2, "0"));
    if (g.hour)   r = r.replace(g.hour, this.getHours().toString().padStart(2, "0"));
    if (g.minute) r = r.replace(g.minute, this.getMinutes().toString().padStart(2, "0"));
    if (g.second) r = r.replace(g.second, this.getSeconds().toString().padStart(2, "0"));
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