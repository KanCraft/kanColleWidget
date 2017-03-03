import Achievement from "../../Models/Achievement";
import {SUPPLY} from "../../../Constants";

export function onSupply() {
  Achievement.increment(SUPPLY);
}
