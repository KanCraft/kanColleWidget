import {onRecoveryStartCompleted} from "../RequestControllers/Recovery";

export function ImageRecognizationDebug(params) {
    switch (params.purpose) {
    default:
        return onRecoveryStartCompleted({}, params.index);
    }
}
