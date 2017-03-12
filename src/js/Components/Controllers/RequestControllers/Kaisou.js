import Achievement from "../../Models/Achievement";
import {CUSTOMIZE} from "../../../Constants";
import {checkQuestStatus} from "./common";

export function onKaisouPowerup(/* detail */) {
  Achievement.increment(CUSTOMIZE);
  checkQuestStatus(CUSTOMIZE);
}
