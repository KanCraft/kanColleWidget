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
