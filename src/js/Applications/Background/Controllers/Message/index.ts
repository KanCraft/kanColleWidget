/**
 * ことさら index.ts を用意する必要は無いのだけれど、
 * Debugコントローラから参照されるときだるいのでindex
 * つくっといたほうがいい。
 * Debugコントローラ以外のものをここに置く。
 */
import * as Capture from "./Capture";
import * as DamageSnapshot from "./DamageSnapshot";
import * as Window from "./Window";

export default {
  ...Capture,
  ...DamageSnapshot,
  ...Window,
};
