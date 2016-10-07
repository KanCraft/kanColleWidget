import ShipsStatusTempWindowManager from "../../Services/ShipsStatusTempWindowManager";

export function onHomePort(/* detail */) {
    ShipsStatusTempWindowManager.getInstance().sweep();
}
