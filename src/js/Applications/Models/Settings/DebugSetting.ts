import {Model} from "chomex";

export default class DebugSetting extends Model {
  static __ns = "DebugSetting";
  static default = {
    "user": {
      on: false,
    }
  }
  on: boolean;
  static user(): DebugSetting {
    return this.find("user");
  }
}