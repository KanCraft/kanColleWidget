import Achievement from "../../Models/Achievement";
import {SUPPLY} from "../../../Constants";

import {checkQuestStatus} from "./common";

export function onSupply() {
  Achievement.increment(SUPPLY);
  checkQuestStatus(SUPPLY);
}
