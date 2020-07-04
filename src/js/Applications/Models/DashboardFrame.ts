import { Model } from "chomex";

export default class DashboardFrame extends Model {
  static __ns = "DashboardFrame";
  static default = {
    "user": {
      position: { top: 100, left: 100 },
      size: { height: 460, width: 340 },
    }
  }
  position: { top: number, left: number };
  size: { height: number, width: number };
  static user(): DashboardFrame {
    return this.find("user");
  }
}