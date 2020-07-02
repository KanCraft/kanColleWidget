/**
 * Number型の拡張は以下に定義する
 */
interface Number {
  pad(max: number, fill?: string): string;
}

/**
 * おもにゼロパディングの用途で使う
 */
Number.prototype.pad = function(max: number, fill = "0"): string {
  return this.toString().padStart(max, fill);
};

/**
 * Date型の拡張は以下に定義する
 */
interface Date {
  toKCWTimeString(withSec?: boolean): string;
  upto(target: number | Date): string;
  getKCDate(): number;
}

Date.prototype.toKCWTimeString = function(withSec = false): string {
  const res = `${this.getHours().pad(2)}:${this.getMinutes().pad(2)}`;
  return withSec ? res + `:${this.getSeconds().pad(2)}` : res;
};

/**
 * まであと何分的なやつ
 */
Date.prototype.upto = function(target: number | Date): string {
  const targetTimestamp = (target instanceof Date) ? target.getTime() : target;
  const milisecDiff = targetTimestamp - this.getTime();
  // TODO: あとでなおす
  const minute = Math.floor(milisecDiff / (1000 * 60));
  return `${minute}分`;
};

/**
 * 艦これ的な日付を返すやつ
 */
Date.prototype.getKCDate = function(): number {
  if (this.getHours() >= 5) return this.getDate();
  // 朝5時よりも前は、まだ昨日なので
  return (new Date(this.getTime() - (24 * 60 * 60 * 1000))).getDate();

};

/**
 * String型の拡張は以下に定義する
 */
interface String {
  format(...args): string;
}

// https://www.it-swarm.dev/ja/javascript/printfstringformat%E3%81%A8%E5%90%8C%E7%AD%89%E3%81%AEjavascript/957771974/
String.prototype.format = function(...args) {
  return this.replace(/{(\d+)}/g, function(match, number) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
};