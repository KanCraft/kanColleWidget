/* eslint-disable @typescript-eslint/no-unused-vars */

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
  upto(target: number | Date): { hours: number, minutes: number, seconds: number };
  toKCDate(): Date;
  getKCDate(): number;
  format(fmt: string): string;
}

Date.prototype.toKCWTimeString = function(withSec = false): string {
  const res = `${this.getHours().pad(2)}:${this.getMinutes().pad(2)}`;
  return withSec ? res + `:${this.getSeconds().pad(2)}` : res;
};

/**
 * まであと何分的なやつ
 */
Date.prototype.upto = function (target: number | Date): { hours: number, minutes: number, seconds: number } {
  const targetTimestamp = (target instanceof Date) ? target.getTime() : target;
  let milisecDiff = targetTimestamp - this.getTime();
  // TODO: あとでなおす
  const hours = Math.floor(milisecDiff / (1000 * 60 * 60));
  milisecDiff = milisecDiff - (hours * 1000 * 60 * 60);
  const minutes = Math.floor(milisecDiff / (1000 * 60));
  milisecDiff = milisecDiff - (minutes * 1000 * 60);
  const seconds = Math.floor(milisecDiff / 1000);
  return { hours, minutes, seconds };
};

/**
 * 艦これ的なDateを返すやつ
 */
Date.prototype.toKCDate = function(): Date {
  if (this.getHours() >= 5) return this;
  // 朝5時よりも前は、まだ昨日なので
  return (new Date(this.getTime() - (24 * 60 * 60 * 1000)));
};

/**
 * 艦これ的な日付を返すやつ
 */
Date.prototype.getKCDate = function(): number {
  return this.toKCDate().getDate();
};

/**
 * フォーマットするやつ
 * FIXME: replaceがgじゃないが
 */
Date.prototype.format = function(fmt: string): string {
  return fmt.replace(
    "yyyy", this.getFullYear().toString()
  ).replace(
    "MM", (this.getMonth() + 1).pad(2)
  ).replace(
    "dd", this.getDate().pad(2)
  ).replace(
    "HH", this.getHours().pad(2)
  ).replace(
    "mm", this.getMinutes().pad(2)
  ).replace(
    "ss", this.getSeconds().pad(2)
  );
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

/**
 * Image型の拡張
 */
interface HTMLImageElement {
  load(uri: string): Promise<HTMLImageElement>;
}
HTMLImageElement.prototype.load = function(uri: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    this.onload = () => resolve(this);
    this.src = uri;
  });
};