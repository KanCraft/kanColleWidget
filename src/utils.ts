
export class KCWDate extends Date {

  static fmt = Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  /**
   * @param format YYYY-mm-dd HH:MM:SS
   * @returns {string} formatted date
   * @see https://www.gnu.org/software/coreutils/manual/html_node/date-invocation.html
   */
  public format(format: string): string {
    const now = KCWDate.fmt.format(this);
    const year = now.slice(0, 4), month = now.slice(5, 7), day = now.slice(8, 10), hour = now.slice(11, 13), minute = now.slice(14, 16), second = now.slice(17, 19);
    const exp = /(?<year>YYYY)|(?<month>mm)|(?<day>dd)|(?<hour>HH)|(?<minute>MM)|(?<second>SS)/g;
    return format.replace(exp, (match) => {
      switch (match) {
        case 'YYYY': return year;
        case 'mm': return month;
        case 'dd': return day;
        case 'HH': return hour;
        case 'MM': return minute;
        case 'SS': return second;
        default: return format;
      }
    });
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