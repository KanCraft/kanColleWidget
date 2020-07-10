import { Model } from "chomex";

export enum SortieContextType {
  Disabled = "disabled",
  Full = "fulltext",
  Short = "short",
}

export default class SortieContextSetting extends Model {
  static __ns = "SortieContextSetting";
  static default = {
    "user": {
      type: SortieContextType.Full,
    },
  };
  type: SortieContextType;
  static user(): SortieContextSetting {
    return this.find("user");
  }
}
