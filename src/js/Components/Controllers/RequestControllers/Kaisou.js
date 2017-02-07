/* global sleep:false */
import Achievement from "../../Models/Achievement";
import {CUSTOMIZE} from "../../../Constants";

export function onKaisouPowerup(/* detail */) {
    
    Achievement.increment(CUSTOMIZE);
    
}
