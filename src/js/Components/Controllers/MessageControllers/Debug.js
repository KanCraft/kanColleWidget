import {onRecoveryStartCompleted} from "../RequestControllers/Recovery";
import {onCreateShipCompleted}    from "../RequestControllers/Kousho";

export function ImageRecognizationDebug(params) {
    switch (params.purpose) {
    case "createship":
        return onCreateShipCompleted({}, params.index);
    case "recovery":
    default:
        return onRecoveryStartCompleted({}, params.index);
    }
}
