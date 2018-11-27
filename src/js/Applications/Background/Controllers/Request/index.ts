/**
 * ことさら index.ts を用意する必要は無いのだけれど、
 * Debugコントローラから参照されるときだるいのでindex
 * つくっといたほうがいい。
 */
import * as Battle from "./Battle";
import * as Mission from "./Mission";
import * as Port from "./Port";
import * as Recovery from "./Recovery";
import * as Shipbuilding from "./Shipbuilding";

export default {
  ...Battle,
  ...Mission,
  ...Port,
  ...Recovery,
  ...Shipbuilding,
};
