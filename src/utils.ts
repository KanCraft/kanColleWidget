
export class WorkerImage {
  constructor(public bitmap: ImageBitmap) {}
  public static async from(uri: string): Promise<WorkerImage>;
  public static async from(blob: Blob): Promise<WorkerImage>;
  public static async from(raw: string | Blob): Promise<WorkerImage> {
    const bitmap = await createImageBitmap(raw instanceof Blob ? raw : await (await fetch(raw)).blob());
    return new this(bitmap);
  }

}

const S = 1000;
const M = 60 * S;
const H = 60 * M;
const D = 24 * H;

export class KCWDate extends Date {

  // デイリーリセット時刻（朝5時）。この時刻より前は前日として扱う
  private static readonly RESET_HOUR = 5;

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

  // 朝5時を境界とした「艦これ的な同じ日」かどうかを返す
  public static isSameKCDay(a: number, b: number): boolean {
    const shifted = (epoch: number) => new Date(epoch - KCWDate.RESET_HOUR * H);
    const da = shifted(a), db = shifted(b);
    return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
  }

  // 朝5時を境界とした「艦これ的な日付」の日部分(1-31)を返す
  public static dayOfMonth(epoch: number = Date.now()): number {
    return new Date(epoch - KCWDate.RESET_HOUR * H).getDate();
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export {
  S, M, H, D
}