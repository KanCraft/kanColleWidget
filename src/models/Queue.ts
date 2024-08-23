import { Model } from "jstorm/chrome/local";
import { Entry, EntryType } from "./entry";


export default class Queue extends Model {
  public static readonly _namespace_ = "Queue";  
  public entryparams: Record<string, any> = {};
  public entrytype: EntryType = EntryType.UNKNOWN;
  public entry<T extends Entry>(): T {
    return {} as T;
  }
}