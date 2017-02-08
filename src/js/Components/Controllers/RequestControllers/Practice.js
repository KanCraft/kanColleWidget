import Achievement from "../../Models/Achievement";
import {PRACTICE}  from "../../../Constants";

export function onPracticeStart() {
    Achievement.increment(PRACTICE);
}
