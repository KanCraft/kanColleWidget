import Achievement from "../../Models/Achievement";
import {PRACTICE}  from "../../../Constants";

import {checkQuestStatus} from "./common";

export function onPracticeStart() {
  Achievement.increment(PRACTICE);
}

export function onPracticePrepare() {
  checkQuestStatus(PRACTICE);
}
