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
}

Date.prototype.toKCWTimeString = function(withSec = false): string {
  const res = `${this.getHours().pad(2)}:${this.getMinutes().pad(2)}`;
  return withSec ? res + `:${this.getSeconds().pad(2)}` : res;
};