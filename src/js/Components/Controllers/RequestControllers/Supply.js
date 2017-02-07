/* global sleep:false */
// ファイルを分けただけデース
import Achievement from "../../Models/Achievement";
import {SUPPLY} from "../../../Constants";

export function onSupply() {
    Achievement.increment(SUPPLY);
}
