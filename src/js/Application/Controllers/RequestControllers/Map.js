import {checkQuestStatus} from "./common";
import {SORTIE} from "../../../Constants";

export function onMapPrepare() {
  checkQuestStatus(SORTIE);
}
